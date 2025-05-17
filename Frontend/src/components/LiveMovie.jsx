import React, { useEffect, useRef, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { BadgeCheck } from "lucide-react";

import { useLocation } from "react-router-dom";

function LiveMovie() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const downloadPageLink = params.get("movieLink");

  console.log(downloadPageLink);

  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuality, setCurrentQuality] = useState("480p");

  // Quality sources
  const qualities = {
    "720p":
      "https://dl5.fastxmp4.com/download/47017/Final-Destination:-Bloodlines-(2025)-Hindi-Dubbed-Movie--720p-[Orgmovies].mp4?st=ZWpTulLDBZpIbfmRhRpKyA&e=1747559853",
    "480p":
      "https://dl2.fastxmp4.com/download/47017/Final-Destination:-Bloodlines-(2025)-Hindi-Dubbed-Movie--480p-[Orgmovies].mp4?st=ZWpTulLDBZpIbfmRhRpKyA&e=1747559853",
  };

  const baseUrl = "https://movie-store-backend.onrender.com/api/stream";
  const referer =
    "https://www.mp4moviez.law/final-destination:-bloodlines-(2025)-hindi-dubbed-movie-hd-47017.html";
  const ua =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
  const cookie =
    "_ga=GA1.1.303971781.1747473456; _ga_2MNVGSXSRS=GS2.1.s1747473456$o1$g0$t1747473456$j0$l0$h1624421269";

  const getStreamUrl = (quality) => {
    const url = qualities[quality];
    return `${baseUrl}?url=${btoa(url)}&referer=${encodeURIComponent(
      referer
    )}&ua=${encodeURIComponent(ua)}&cookie=${encodeURIComponent(cookie)}`;
  };

  const changeQuality = (quality) => {
    if (!playerRef.current) return;
    setIsLoading(true);
    const currentTime = playerRef.current.currentTime();
    setCurrentQuality(quality);

    playerRef.current.src({
      src: getStreamUrl(quality),
      type: "video/mp4",
    });
    playerRef.current.load();
    playerRef.current.one("loadeddata", () => {
      playerRef.current.currentTime(currentTime);
      playerRef.current.play();
      setIsLoading(false);
    });
  };

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
      sources: [
        {
          src: getStreamUrl(currentQuality),
          type: "video/mp4",
        },
      ],
    });

    player.ready(() => {
      const bigPlayButton = playerRef.current
        ?.el()
        ?.querySelector(".vjs-big-play-button");
      if (bigPlayButton) {
        bigPlayButton.style.display = "none";
      }
    });

    player.one("loadeddata", () => setIsLoading(false));
    playerRef.current = player;

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
          Final Destination: Bloodlines
        </h1>
        <span className="mt-2 inline-block bg-white text-black px-3 py-1 rounded-full text-sm">
          {currentQuality}
        </span>
      </div>

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
      <div className="flex space-x-3 mt-4">
        {Object.keys(qualities).map((q) => (
          <button
            key={q}
            onClick={() => changeQuality(q)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center space-x-2 ${
              currentQuality === q
                ? "bg-white text-black"
                : "bg-gray-800 hover:bg-gray-700 text-white"
            }`}
          >
            <BadgeCheck className="w-4 h-4" />
            <span>{q}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LiveMovie;
