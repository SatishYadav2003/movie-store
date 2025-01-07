import React from "react";

function MovieTemplate({ movie_name, movie_category, movie_genre , movie_img_url}) {
  return (
    <div className="bg-sky-200 p-2.5 hover:bg-sky-300 duration-300 cursor-pointer my-5 flex items-center gap-4 rounded-md shadow-md">
      <div className="w-28 sm:w-32 md:w-36 lg:w-40 flex-shrink-0">
        <img
          className="w-full h-auto rounded-md hover:scale-105 duration-300 "
          src={movie_img_url}
          alt="movie-img"
        />
      </div>

      <div className="flex flex-col w-full">
        <div>
          <span className="block font-semibold text-sm sm:text-base md:text-lg">
            {movie_name}
          </span>
          <span className="block text-pink-600 text-xs sm:text-sm md:text-base">
            {movie_category}
          </span>
        </div>
        <span className="text-red-700 text-xs sm:text-sm md:text-base">
          {movie_genre.slice(0, -1)}
        </span>
      </div>
    </div>
  );
}

export default MovieTemplate;
