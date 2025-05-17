import { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { BadgeCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../config.js";
import axios from "axios";

function LiveMovie() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const movieLink = params.get("movieLink");

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [currentQualityIndex, setCurrentQualityIndex] = useState(0);
  const [error, setError] = useState(null);
  const [isFetchingLinks, setIsFetchingLinks] = useState(false);

  const getStreamUrl = (url, headers) => {
    return `${BASE_URL}/api/stream?url=${btoa(
      url
    )}&referer=${encodeURIComponent(headers.referer)}&ua=${encodeURIComponent(
      headers["user-agent"]
    )}&cookie=${encodeURIComponent(headers.cookie)}`;
  };

  useEffect(() => {
    if (!movieLink) return;

    const fetchLinks = async () => {
      setIsFetchingLinks(true);
      setError(null);

      try {
        const res = await axios.get(
          `https://latest-link.onrender.com/get-download-links?url=${encodeURIComponent(
            movieLink
          )}`
        );

        if (res.data && res.data.downloadLinks) {
          const playableLinks = res.data.downloadLinks.filter((link) =>
            link.url.includes("fastxmp4")
          );
          if (playableLinks.length === 0) {
            setError("No playable download links found.");
          }
          setDownloadLinks(playableLinks);
          setCurrentQualityIndex(0);
        } else {
          setError("No download links found in response.");
          setDownloadLinks([]);
        }
      } catch (err) {
        console.error("Failed to fetch download links:", err);
        setError("Failed to fetch download links. Please try again later.");
        setDownloadLinks([]);
      } finally {
        setIsFetchingLinks(false);
      }
    };

    fetchLinks();
  }, [movieLink]);

  useEffect(() => {
    if (!playerRef.current || downloadLinks.length === 0) return;

    setIsLoading(true);

    try {
      const { url, headers } = downloadLinks[currentQualityIndex];
      const streamUrl = getStreamUrl(url, headers);

      const currentTime = playerRef.current.currentTime();

      playerRef.current.src({
        src: streamUrl,
        type: "video/mp4",
      });
      playerRef.current.load();

      playerRef.current.one("loadeddata", () => {
        playerRef.current.currentTime(currentTime);
        playerRef.current.play();
        setIsLoading(false);
      });
    } catch (err) {
      console.error("Error setting video source:", err);
      setError("Error loading video. Please try another quality.");
      setIsLoading(false);
    }
  }, [currentQualityIndex, downloadLinks]);

  useEffect(() => {
    if (playerRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: false,
      preload: "auto",
      fluid: true,
      responsive: true,
      playbackRates: [0.5, 1, 1.25, 1.5, 2],
      controlBar: {
        volumePanel: true,
        fullscreenToggle: true,
        playToggle: true,
      },
      bigPlayButton: false,
      sources: [],
    });

    playerRef.current = player;

    player.one("loadeddata", () => setIsLoading(false));

    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white py-6 px-3 flex flex-col items-center justify-start max-w-6xl mx-auto">
      {/* Title container with compact design */}
      <div className="text-center mb-4 w-full min-h-[3rem]">
        <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
          {isFetchingLinks
            ? "Please Wait..."
            : downloadLinks.length > 0 && !error
            ? downloadLinks[currentQualityIndex].resolution
            : "Loading Movie..."}
        </h1>
        <span className="mt-1 inline-block bg-white text-black px-2 py-0.5 rounded-full text-xs tracking-wide">
          {!isFetchingLinks && downloadLinks.length > 0 && !error
            ? downloadLinks[currentQualityIndex].url.match(/\d+p/)
              ? downloadLinks[currentQualityIndex].url.match(/\d+p/)[0]
              : downloadLinks[currentQualityIndex].url
            : "Unknown"}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 text-red-500 font-medium w-full text-center text-sm">
          {error}
        </div>
      )}

      {/* Video Frame Container */}
      <div className="w-full max-w-4xl mx-auto relative rounded-md overflow-hidden border border-gray-800 shadow-lg bg-[#111]">
        {(isLoading || isFetchingLinks) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 z-10 space-y-3">
            <div className="w-10 h-10 border-3 border-t-white border-transparent rounded-full animate-spin"></div>
            <div className="text-white text-sm font-medium text-center px-4 max-w-xs">
              {isFetchingLinks
                ? "Fetching Different resolution links..."
                : "Loading video..."}
            </div>
          </div>
        )}
        {/* Aspect ratio wrapper ensures consistent height based on width */}
        <div data-vjs-player className="aspect-video max-w-full">
          <video
            ref={videoRef}
            className="video-js vjs-default-skin rounded-md w-full h-full"
          />
        </div>
      </div>

      {/* Quality Buttons - Compact and Responsive */}
      <div className="flex flex-wrap justify-center w-full max-w-4xl mx-auto mt-4 gap-2">
        {downloadLinks.map((link, index) => {
          const resolutionMatch = link.url.match(/\d+p/);
          const label = resolutionMatch
            ? resolutionMatch[0]
            : link.resolution || `Quality ${index + 1}`;

          return (
            <button
              key={index}
              onClick={() => setCurrentQualityIndex(index)}
              disabled={isLoading || isFetchingLinks}
              className={`px-3 py-1.5 rounded text-xs font-medium transition flex items-center space-x-1 min-w-[70px] justify-center ${
                currentQualityIndex === index
                  ? "bg-white text-black"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              } ${
                isLoading || isFetchingLinks
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <BadgeCheck className="w-3 h-3" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LiveMovie;