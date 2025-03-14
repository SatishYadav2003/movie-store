import React, { useState, useEffect } from "react";
import MovieTemplate from "./MovieTemplate";
import { useMovieResult } from "../contextApi/MovieProvider";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-hot-toast";
import BoundryBorder from "./BoundryBorder";
import RequestMovieButton from "./RequestMovieButton";

function MovieList({ user }) {
  const [, movies] = useMovieResult();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const moviesPerPage = 30;

  const totalPages = Math.ceil(movies.length / moviesPerPage);

  const currentMovies = movies.slice(
    (currentPage - 1) * moviesPerPage,
    currentPage * moviesPerPage
  );

  const handleMovieDetail = (movieJson) => {
    navigate("/movie-detail", { state: movieJson });
  };

  const handleInputChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      if (value < 1) value = 1;
      if (value > totalPages) value = totalPages;
    } else {
      value = "";
    }
    setInputPage(value);
  };

  useEffect(() => {
    const preloadImages = async () => {
      setLoading(true);

      const imagePromises = currentMovies.map(
        (movie) =>
          new Promise((resolve, reject) => {
            const img = new Image();
            img.src = movie["movie_img_url"];
            img.onload = resolve;
            img.onerror = reject;
          })
      );

      try {
        await Promise.all(imagePromises);
      } catch (error) {
        console.error("Image failed to load", error);
      } finally {
        setLoading(false);
      }
    };

    preloadImages();
  }, [currentPage]);

  const handlePageJump = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setLoading(true);
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error(
        `Please enter a valid page number between 1 to ${totalPages}`
      );
    }
    setInputPage("");
  };

  return (
    <div className="relative">
      {loading ? (
        <div className="flex flex-col items-center">
          <ClipLoader color="#3498db" loading={loading} size={80} />
          <p className="text-center text-gray-500 text-xl mt-4">
            Just a sec, movie magic coming your way!
          </p>
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center text-red-500 font-semibold text-xl flex justify-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-found-2511608-2133696.png"
            alt="No-Data-Found"
          />
        </div>
      ) : (
        <>
          {currentMovies.map((movie, index) => (
            <div key={index} onClick={() => handleMovieDetail(movie)}>
              <MovieTemplate
                movie_name={movie["Movie Name"]}
                movie_category={movie["Movie Category"]}
                movie_genre={movie["Genre"]}
                movie_img_url={movie["movie_img_url"]}
              />
            </div>
          ))}

          <div className="flex flex-col items-center mt-6 space-y-4 w-full">
            <div className="flex justify-center items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <input
                type="number"
                value={inputPage}
                onChange={handleInputChange}
                placeholder={`Page (1-${totalPages})`}
                className="px-4 py-2 text-lg rounded-lg border-[2px] border-sky-300 outline-none w-40 sm:w-48 md:w-60 shadow-lg ring-sky-500 hover:ring-2 duration-300 focus:ring-2 text-center"
                min="1"
                max={totalPages}
              />

              <button
                onClick={handlePageJump}
                className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded transition w-20 sm:w-28"
              >
                Go
              </button>
            </div>

            <div className="flex gap-2 sm:gap-4">
              <button
                className={`px-6 py-2 rounded transition ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Prev
              </button>

              <button
                className={`px-6 py-2 rounded transition ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-700 text-white"
                }`}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>

            <p className="text-gray-700 font-semibold text-center text-sm sm:text-base">
              Page {currentPage} of {totalPages}
            </p>
          </div>
          <RequestMovieButton user={user} />
          <BoundryBorder />
        </>
      )}
    </div>
  );
}

export default MovieList;
