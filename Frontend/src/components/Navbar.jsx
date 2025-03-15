import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMovieResult } from "../contextApi/MovieProvider";
import toast from "react-hot-toast";
import { FaTelegramPlane } from "react-icons/fa";

function Navbar({ user, handleLogout }) {
  const [handleSetMovie] = useMovieResult();
  const navigate = useNavigate();

  const handleButton = () => {
    toast.success("Redirecting to Telegram...");
    setTimeout(() => {
      window.open("https://tpi.li/movie4u", "_blank");
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center justify-between p-5 max-md:flex-col ">
        <div className="relative w-fit mx-2 select-none max-md:mb-10 ">
          <div className="text-5xl lg:text-6xl font-semibold ">
            <span className="text-red-600">Movie</span>4u
          </div>
          <div className="text-pink-600 text-xs absolute right-0 ">
            No.1 Movie Platform
          </div>
        </div>
        <div className="flex gap-3 w-2/3 mx-2 max-md:flex-col max-md:w-full items-center">
          <input
            onChange={(e) => handleSetMovie(e.target.value.trim())}
            type="text"
            placeholder="Enter the movie name..."
            className="px-4 py-3 max-extra-sm:py-2 text-lg rounded-lg border-[2px] border-sky-300 outline-none w-full shadow-lg ring-sky-500 hover:ring-2 duration-300 focus:ring-2"
          />
          <motion.button
            onClick={handleButton}
            whileTap={{ scale: 0.85 }}
            className="cursor-pointer max-sm:w-full flex items-center justify-center gap-2 text-white px-4 py-3 max-extra-sm:py-2.5 max-extra-sm:text-lg rounded-lg text-lg lg:w-1/4 bg-gradient-to-r from-blue-500 to-sky-500 duration-300 shadow-lg ring-1 whitespace-nowrap"
          >
            <span className="font-bold ">Join Us on</span>
            <FaTelegramPlane
              size={30}
              className="bg-white rounded-full p-1 "
              color="#0088cc"
            />
          </motion.button>
          {/* Login/Logout Button */}
          <button
            onClick={() => (user ? handleLogout() : navigate("/login"))}
            className={`px-5 py-3 rounded-lg shadow-md text-white ${
              user
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
