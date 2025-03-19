import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import BoundryBorder from "./BoundryBorder";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { BASE_URL } from "../config.js";

function IndividualMovieLister() {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMovieLoading, setIsMovieLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDownloadPage = async () => {
    try {
      setIsLoading(true);
      const movie_link = movie.download_page_link;

      const shrink_link = await axios.get(
        `https://shrinkearn.com/api?api=06007e4e01fb7c122a8982045253540a1d8e638d&url=${movie_link}`
      );

      toast.success("We are redirecting to new page");

      setTimeout(() => {
        window.open(shrink_link.data.shortenedUrl, "_blank");
      }, 1000);
    } catch (error) {
      toast.error("Failed to generate download link");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsMovieLoading(true);
        setError(null);

        const response = await axios.get(`${BASE_URL}/api/movies/${movie_id}`);
        setMovie(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Movie not found");
        } else {
          setError("Failed to fetch movie details");
        }
      } finally {
        setIsMovieLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movie_id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isMovieLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ClipLoader color="#3498db" loading={true} size={80} />
        <p className="text-center text-gray-500 text-xl mt-4">
          Just a sec, movie magic coming your way!
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-2xl text-red-500 font-semibold">{error}</p>
        <p className="text-lg text-gray-500 mt-2">
          Oops! We couldn't find this movie.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-fit mb-5 mt-2 select-none max-md:mb-5 mx-auto">
        <div className="text-5xl  lg:text-6xl font-semibold ">
          <span className="text-red-600">Movie</span>
          4u
        </div>
        <div className="text-pink-600 text-xs absolute right-0 ">
          No.1 Movie Platform
        </div>
      </div>

      <div className="relative flex flex-col justify-between select-none">
        <div className="w-full bg-sky-500 my-4 text-center py-2 text-white">
          <span className="sm:text-xl font-semibold">
            {movie["Movie Name"]}
          </span>
        </div>

        <div className="mx-auto mb-6 w-44 sm:w-52 md:w-60 lg:w-72 flex-shrink-0">
          <img
            src={movie.movie_img_url}
            alt={movie["Movie Name"]}
            className="cursor-pointer w-full h-auto hover:scale-105 duration-300  rounded-lg shadow-lg shadow-sky-500"
          />
        </div>

        <div className="w-full bg-sky-500 my-4 text-center py-2 text-white select-none">
          <span className="sm:text-xl font-semibold">Movie Description</span>
        </div>

        <div className="w-full mb-4 sm:text-lg select-none bg-sky-200 shadow-md">
          <p className=" mb-4 text-pink-500 font-sans font-semibold px-2">
            <span className=" text-gray-700 font-bold">Name :</span>{" "}
            {movie["Movie Name"]}
          </p>

          <p className=" mb-4 text-fuchsia-500 font-sans font-semibold px-2">
            <span className=" text-gray-700 font-bold">Description :</span>{" "}
            {movie["Movie Description"]}
          </p>

          <p className="text-red-500 mb-4  font-sans font-semibold px-2">
            <span className="text-gray-700 font-bold">Category :</span>{" "}
            {movie["Movie Category"]}
          </p>

          <p className="text-pink-500 mb-4  font-sans font-semibold px-2">
            <span className="text-gray-700 font-bold">Genre :</span>{" "}
            {movie.Genre}
          </p>

          <p className="text-red-700 mb-4  font-sans font-semibold px-2">
            <span className="text-gray-700 font-bold">Release Date :</span>{" "}
            {movie["Release Date"]}
          </p>

          <p className="text-green-500 mb-4  font-sans font-semibold px-2">
            <span className="text-gray-700 font-bold">Starring :</span>{" "}
            {movie.Staring}
          </p>

          <p className="text-blue-700 mb-4  font-sans font-semibold px-2">
            <span className="text-gray-700 font-bold">Director :</span>{" "}
            {movie["Director:"].slice(0, -1).length === 0
              ? "Not Known"
              : movie["Director:"].slice(0, -1)}
          </p>

          <p className="text-orange-500 mb-4  font-sans font-semibold px-2">
            <span className="text-gray-700 font-bold">Rating :</span>{" "}
            {movie.Rating}
          </p>
        </div>

        <div className="w-full bg-sky-500 my-4 text-center py-2 text-white">
          <span className="sm:text-xl font-semibold">
            {movie["Movie Name"]} full movie download
          </span>
        </div>

        <div className="w-full flex justify-center mb-6">
          <motion.button
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 1 }}
            onClick={handleDownloadPage}
            disabled={isLoading}
            className="relative flex justify-center items-center gap-2 bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-600"
          >
            {isLoading && (
              <motion.div
                className="absolute flex justify-center items-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 20,
                  height: 20,
                  border: "4px solid transparent",
                  borderTopColor: "white",
                  borderRadius: "50%",
                }}
              />
            )}

            <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>
              Go to Download Section
            </span>
          </motion.button>
        </div>
      </div>
      <BoundryBorder />
    </>
  );
}

export default IndividualMovieLister;
