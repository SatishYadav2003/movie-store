import React, { useState, useEffect } from "react";
import MovieTemplate from "./MovieTemplate";
import { useMovieResult } from "../contextApi/MovieProvider";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Import spinner

function MovieList() {
  const [, movies] = useMovieResult();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleMovieDetail = (movieJson) => {
    navigate("/movie-detail", { state: movieJson });
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const preloadImages = async () => {
      const imagePromises = movies.map(
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
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    preloadImages();
  }, [movies]);

  return (
    <div>
      {loading ? (
        <div className="flex flex-col items-center">
          <ClipLoader color="#3498db" loading={loading} size={80} />
          <p className="text-center text-gray-500 text-xl mt-4">
            Just a sec, movie magic coming your way!
          </p>
        </div>
      ) : movies.length === 0 ? (
        <div className=" text-center text-red-500 font-semibold text-xl flex justify-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/no-search-found-2511608-2133696.png"
            alt="No-Data-Found"
          />
        </div>
      ) : (
        movies.map((movie, index) => (
          <div key={index} onClick={() => handleMovieDetail(movie)}>
            <MovieTemplate
              key={index}
              movie_name={movie["Movie Name"]}
              movie_category={movie["Movie Category"]}
              movie_genre={movie["Genre"]}
              movie_img_url={movie["movie_img_url"]}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default MovieList;
