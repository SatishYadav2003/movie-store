import React, { useState, useEffect, useCallback } from "react";
import MovieTemplate from "./MovieTemplate";
import { useMovieResult } from "../contextApi/MovieProvider";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-hot-toast";
import RequestMovieButton from "./RequestMovieButton";
import { motion } from "framer-motion";

function SkeletonCard() {
  return (
    <div className="bg-[#1e1e1e] rounded-md animate-pulse">
      <div className="w-full h-52 bg-[#2a2a2a] rounded-t-md" />
      <div className="p-2 space-y-2">
        <div className="h-4 bg-[#2a2a2a] rounded w-3/4" />
        <div className="h-3 bg-[#2a2a2a] rounded w-1/2" />
      </div>
    </div>
  );
}

function MovieList({ user }) {
  const [, movies] = useMovieResult();
  const [loading, setLoading] = useState(true);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const navigate = useNavigate();
  const moviesPerPage = 30;

  const totalPages = Math.ceil(movies.length / moviesPerPage);
  const currentMovies = movies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  useEffect(() => {
    if (movies.length > 0) setMoviesLoading(false);
  }, [movies]);

  const preloadImages = async () => {
    setLoading(true);
    const imagePromises = currentMovies.map(
      (movie) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = movie["movie_img_url"];
          img.onload = resolve;
          img.onerror = resolve;
        })
    );
    await Promise.all(imagePromises);
    setLoading(false);
  };

  useEffect(() => {
    if (!moviesLoading) preloadImages();
  }, [currentPage, moviesLoading]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (val === "") return setInputPage("");
    const num = Math.max(1, Math.min(Number(val), totalPages));
    setInputPage(num);
  };

  const handlePageJump = () => {
    const page = parseInt(inputPage);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error(`Enter page number between 1 to ${totalPages}`);
    }
    setInputPage("");
  };

  const goToPage = (dir) => {
    const page = dir === "prev" ? currentPage - 1 : currentPage + 1;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowLeft" && currentPage > 1) goToPage("prev");
      if (e.key === "ArrowRight" && currentPage < totalPages) goToPage("next");
    },
    [currentPage, totalPages]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative bg-[#0b0b0c] min-h-screen text-white px-4 py-10">
      {/* Initial Movie Fetching */}
      {moviesLoading ? (
        <div className="flex flex-col items-center mt-16">
          <ClipLoader color="#ff66cc" loading={true} size={80} />
          <p className="text-pink-300 mt-4 text-lg animate-pulse text-center">
            Just a sec, movie magic coming your way!
          </p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-pink-400 font-semibold text-xl flex justify-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-found-2511608-2133696.png"
            alt="No Data"
          />
        </div>
      ) : (
        <>
          {/* Movie Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {loading
              ? Array.from({ length: currentMovies.length }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : currentMovies.map((movie, i) => (
                  <motion.div
                    key={movie.movie_id}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <MovieTemplate
                      movie_name={movie["Movie Name"]}
                      movie_category={movie["Movie Category"]}
                      movie_genre={movie["Genre"]}
                      movie_img_url={movie.movie_img_url}
                      movie_rating={movie["Rating"]}
                      onClick={() =>
                        navigate(`/movie-detail/${movie.movie_id}`)
                      }
                    />
                  </motion.div>
                ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col items-center mt-10 space-y-6 px-4">
            <div className="flex flex-wrap justify-center items-center gap-3 w-full max-w-md">
              <input
                type="number"
                value={inputPage}
                onChange={handleInputChange}
                placeholder={`Page (1-${totalPages})`}
                className="flex-1 min-w-[120px] max-w-[180px] px-4 py-2 rounded-md bg-[#2a2a2a] border border-pink-500 text-pink-300 placeholder-pink-300 text-center no-spinner"
              />
              <button
                onClick={handlePageJump}
                className="px-5 py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-all whitespace-nowrap"
              >
                Go
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full">
              <button
                className={`px-6 py-2 rounded-md text-white transition-all duration-300 ${
                  currentPage === 1
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                }`}
                disabled={currentPage === 1}
                onClick={() => goToPage("prev")}
              >
                ⬅ Prev
              </button>
              <button
                className={`px-6 py-2 rounded-md text-white transition-all duration-300 ${
                  currentPage === totalPages
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => goToPage("next")}
              >
                Next ➡
              </button>
            </div>

            <p className="text-pink-300 font-medium text-sm text-center">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <RequestMovieButton user={user} />
        </>
      )}
    </div>
  );
}

export default MovieList;
