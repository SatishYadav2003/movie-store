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
  const [volume, setVolume] = useState(1);
  const [brightness, setBrightness] = useState(1);
  const brightnessOverlayRef = useRef(null);

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

  // Gesture logic
  const tapTimeout = useRef(null);
  const gestureStart = useRef(null);
  const holdInterval = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    const { clientX, clientY } = e.touches[0];
    gestureStart.current = { x: clientX, y: clientY };

    const half = window.innerWidth / 2;

    // Hold-to-seek
    holdInterval.current = setInterval(() => {
      if (!playerRef.current) return;
      if (clientX > half) {
        playerRef.current.currentTime(playerRef.current.currentTime() + 1);
      } else {
        playerRef.current.currentTime(playerRef.current.currentTime() - 1);
      }
    }, 200);
  };

  const handleTouchMove = (e) => {
    if (!gestureStart.current || e.touches.length !== 1) return;

    const deltaY = e.touches[0].clientY - gestureStart.current.y;
    const screenWidth = window.innerWidth;
    const side = gestureStart.current.x < screenWidth / 2 ? "left" : "right";

    if (side === "right") {
      // Volume control
      const newVolume = Math.min(1, Math.max(0, volume - deltaY / 300));
      playerRef.current.volume(newVolume);
      setVolume(newVolume);
    } else {
      // Brightness simulation
      const newBrightness = Math.min(1, Math.max(0.2, brightness - deltaY / 300));
      setBrightness(newBrightness);
      if (brightnessOverlayRef.current) {
        brightnessOverlayRef.current.style.opacity = 1 - newBrightness;
      }
    }

    gestureStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e) => {
    clearInterval(holdInterval.current);
    const touch = e.changedTouches[0];
    const half = window.innerWidth / 2;

    // Double-tap to seek
    if (tapTimeout.current) {
      clearTimeout(tapTimeout.current);
      tapTimeout.current = null;
      if (touch.clientX > half) {
        playerRef.current.currentTime(playerRef.current.currentTime() + 10);
      } else {
        playerRef.current.currentTime(playerRef.current.currentTime() - 10);
      }
    } else {
      tapTimeout.current = setTimeout(() => {
        tapTimeout.current = null;
      }, 250);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6 flex flex-col items-center justify-center space-y-4">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold">
          {isFetchingLinks
            ? "Please Wait..."
            : downloadLinks.length > 0 && !error
            ? downloadLinks[currentQualityIndex].url.match(/\d+p/)?.[0]
            : "Loading Movie..."}
        </h1>
      </div>

      {/* Error */}
      {error && (
        <div className="text-red-500 font-semibold">{error}</div>
      )}

      {/* Video Container */}
      <div
        className="w-full max-w-4xl relative rounded-lg overflow-hidden border border-gray-700 shadow-lg bg-[#111]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {(isLoading || isFetchingLinks) && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-70">
            <div className="text-white animate-spin border-4 border-t-white border-gray-600 rounded-full h-12 w-12"></div>
          </div>
        )}
        <div ref={brightnessOverlayRef} className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-200" style={{ opacity: 0 }} />
        <div data-vjs-player className="aspect-video">
          <video ref={videoRef} className="video-js vjs-default-skin rounded-lg" />
        </div>
      </div>

      {/* Quality Selector */}
      <div className="flex flex-wrap justify-center gap-3">
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
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 transition ${
                currentQualityIndex === index
                  ? "bg-white text-black"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              } ${isLoading || isFetchingLinks ? "opacity-50 cursor-not-allowed" : ""}`}
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
