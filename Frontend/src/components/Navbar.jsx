import React from "react";
import { motion } from "framer-motion";
import { useMovieResult } from "../contextApi/MovieProvider";
import toast from "react-hot-toast"

function Navbar() {
  const [handleSetMovie] = useMovieResult();

  const handleButton = () => {
    toast.success("Refreshing the page")
    setInterval(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <div className="flex items-center justify-between p-5 max-md:flex-col ">
        <div className="relative w-fit mx-2 select-none max-md:mb-10 ">
          <div className="text-5xl  lg:text-6xl font-semibold ">
            <span className="text-red-600">Movie</span>
            4u
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
            className="px-4 py-3 max-extra-sm:py-2  text-lg rounded-lg border-[2px] border-sky-300 outline-none w-full shadow-lg  ring-sky-500 hover:ring-2 duration-300 focus:ring-2"
          />
          <motion.button
            onClick={handleButton}
            whileTap={{ scale: 0.85 }}
            className="cursor-pointer max-sm:w-full text-white px-4 py-3 max-extra-sm:py-2.5 max-extra-sm:text-lg  rounded-lg text-xl font-semibold lg:w-1/5 bg-gradient-to-r from-blue-500 to-sky-500 duration-300 shadow-lg ring-1"
          >
            Refresh
          </motion.button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
