import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMovieResult } from "../contextApi/MovieProvider";
import toast from "react-hot-toast";
import { FaTelegramPlane, FaBars, FaTimes } from "react-icons/fa";

function Navbar({ user, handleLogout }) {
  const [handleSetMovie] = useMovieResult();
  const navigate = useNavigate();

  const [movieInputValue, setMovieInputValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);

  const handleButton = () => {
    toast.success("Redirecting to Telegram...");
    setTimeout(() => {
      window.open("https://tpi.li/movie4u", "_blank");
    }, 1000);
  };

  useEffect(() => {
    if (movieInputValue === "") {
      handleSetMovie("");
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const delay = setTimeout(() => {
      handleSetMovie(movieInputValue);
      setIsSearching(false);
    }, 2000);

    return () => clearTimeout(delay);
  }, [movieInputValue]);

  return (
    <>
      {/* Main Navbar */}
      <div className="w-full px-4 py-5 bg-black text-white flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Logo + Hamburger */}
        <div className="flex items-center justify-between w-full md:w-fit">
          <div className="select-none relative">
            <div className="text-3xl md:text-4xl font-bold">
              <span className="text-red-600">Movie</span>
              <span className="text-sky-600">4u</span>
            </div>
            <div className="text-pink-500 text-xs -mt-1 absolute right-0">
              No.1 Movie Platform
            </div>
          </div>

          <div className="md:hidden">
            <FaBars
              size={20}
              className="cursor-pointer"
              onClick={() => setIsSliderOpen(true)}
            />
          </div>
        </div>

        {/* Right Section: Search + Buttons */}
        <div className="w-full md:w-fit md:flex md:items-center md:gap-4 md:ml-auto">
          {/* Search */}
          <div className="w-full md:w-[250px] relative my-2 md:my-0">
            <input
              type="text"
              value={movieInputValue}
              onChange={(e) => setMovieInputValue(e.target.value.trimStart())}
              placeholder="Enter the movie name..."
              className="w-full px-1 py-2 text-base bg-black text-white border-b-[1.5px] border-white placeholder-gray-400 focus:outline-none"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 rounded-full bg-white animate-ping" />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              onClick={handleButton}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg shadow-md"
            >
              <span className="font-semibold whitespace-nowrap">
                Join Us on
              </span>
              <FaTelegramPlane
                size={24}
                className="bg-white rounded-full p-1"
                color="#0088cc"
              />
            </motion.button>

            <button
              onClick={() => (user ? handleLogout() : navigate("/login"))}
              className={`px-4 py-2 rounded-lg shadow-md text-white whitespace-nowrap ${
                user
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slider */}
      <AnimatePresence>
        {isSliderOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
            className="fixed top-0 right-0 h-full w-64 bg-[rgba(0,0,0,0.9)] text-white z-50 p-5 shadow-lg flex flex-col items-center justify-center gap-6"
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 mt-4">
              <FaTimes
                size={20}
                className="cursor-pointer"
                onClick={() => setIsSliderOpen(false)}
              />
            </div>

            {/* Telegram Button (Full Width) */}
            <motion.button
              onClick={() => {
                handleButton();
                setIsSliderOpen(false);
              }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-lg shadow-md text-lg font-semibold"
            >
              <span>Join Us on</span>
              <FaTelegramPlane
                size={24}
                className="bg-white rounded-full p-1"
                color="#0088cc"
              />
            </motion.button>

            {/* Login / Logout Button (Full Width) */}
            <button
              onClick={() => {
                setIsSliderOpen(false);
                user ? handleLogout() : navigate("/login");
              }}
              className={`w-full px-4 py-3 rounded-lg shadow-md text-white text-lg font-semibold ${
                user
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {user ? "Logout" : "Login"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
