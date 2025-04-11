import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BASE_URL } from "../config.js";

function MovieSlider() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchTopMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/top_rated_movies`);
        setMovies(response.data);
      } catch (err) {
        console.error("Failed to fetch top movies:", err);
      }
    };

    fetchTopMovies();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {movies.map((movie, idx) => (
          <div key={idx}>
            {/* Small screen layout */}
            <div className="flex flex-col md:hidden items-center justify-center p-4 space-y-3">
              <Link to={`/movie-detail/${movie.movie_id}`} className="w-full">
                <img
                  src={movie.movie_img_url}
                  alt={movie["Movie Name"]}
                  className="w-full h-auto max-h-[400px] object-contain"
                />
              </Link>
              <h2 className="text-white text-xl font-semibold text-center">
                {movie["Movie Name"]}
              </h2>
            </div>

            {/* Large screen layout */}
            <div className="hidden md:flex w-full h-[65vh] relative overflow-hidden">
              {/* Gradient Overlay */}
              <div className="absolute left-0 top-0 h-full w-1/2 z-10 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

              {/* Left: Movie Content */}
              <div className="w-1/2 h-full flex items-center px-12 z-20">
                <div className="space-y-4 text-white">
                  <h2 className="text-4xl font-bold leading-snug">
                    {movie["Movie Name"]}
                  </h2>
                  <div className="flex gap-3 flex-wrap text-sm text-gray-300">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">
                      HD
                    </span>
                    <span>Duration: {movie?.duration || "N/A"}</span>
                    <span>IMDB: {movie.Rating || "N/A"}</span>
                    <span>Genre: {movie.Genre}</span>
                    <span>Release: {movie["Release Date"]}</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-4">
                    {movie["Movie Description"]}
                  </p>
                  <Link
                    to={`/movie-detail/${movie.movie_id}`}
                    className="inline-block mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 transition-all text-white font-semibold rounded"
                  >
                    🎬 Download Movie
                  </Link>
                </div>
              </div>

              {/* Right: Movie Image */}
              <div className="w-1/2 h-full flex items-center justify-center p-0 z-10">
                <img
                  src={movie.movie_img_url}
                  alt={movie["Movie Name"]}
                  className="w-full h-auto max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default MovieSlider;
