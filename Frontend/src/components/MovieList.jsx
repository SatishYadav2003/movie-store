import React from "react";
import MovieTemplate from "./MovieTemplate";
import { useMovieResult } from "../contextApi/MovieProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function MovieList() {
  const [, movies] = useMovieResult();

  const navigate = useNavigate();

  const handleMovieDetail = (movieJson) => {
    navigate("/movie-detail", { state: movieJson });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      {movies.length === 0 ? (
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
