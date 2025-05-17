import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { BadgeCheck } from "lucide-react";
import { useLocation } from "react-router-dom";
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

  const baseUrl = "https://movie-store-backend.onrender.com/api/stream";

  const getStreamUrl = (url, headers) => {
    return `${baseUrl}?url=${btoa(url)}&referer=${encodeURIComponent(
      headers.referer
    )}&ua=${encodeURIComponent(headers["user-agent"])}&cookie=${encodeURIComponent(
      headers.cookie
    )}`;
  };

  useEffect(() => {
    if (!movieLink) return;

    const fetchLinks = async () => {
      setIsLoading(true);
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
        }
      } catch (err) {
        console.error("Failed to fetch download links:", err);
        setError("Failed to fetch download links. Please try again later.");
      } finally {
        setIsLoading(false);
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
      },
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
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-4xl font-extrabold text-white">
          {downloadLinks.length > 0 && !error
            ? downloadLinks[currentQualityIndex].resolution
            : "Loading Movie..."}
        </h1>
        <span className="mt-2 inline-block bg-white text-black px-3 py-1 rounded-full text-sm">
          {downloadLinks.length > 0 && !error
            ? downloadLinks[currentQualityIndex].resolution.match(/\d+p/)?.[0] || "Unknown"
            : ""}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 text-red-500 font-semibold">
          {error}
        </div>
      )}

      {/* Video Frame Container */}
      <div className="w-full max-w-4xl mx-auto relative rounded-lg overflow-hidden border border-gray-700 shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-[#111]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 z-10">
            <div className="w-12 h-12 border-4 border-t-white border-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <div data-vjs-player className="aspect-video">
          <video
            ref={videoRef}
            className="video-js vjs-default-skin rounded-lg"
          />
        </div>
      </div>

      {/* Quality Buttons */}
      <div className="flex space-x-3 mt-4 flex-wrap justify-center max-w-4xl">
        {downloadLinks.map((link, index) => {
          const resolutionMatch = link.resolution.match(/\d+p/);
          const label = resolutionMatch ? resolutionMatch[0] : `Quality ${index + 1}`;

          return (
            <button
              key={index}
              onClick={() => setCurrentQualityIndex(index)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center space-x-2 ${
                currentQualityIndex === index
                  ? "bg-white text-black"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <BadgeCheck className="w-4 h-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LiveMovie;
