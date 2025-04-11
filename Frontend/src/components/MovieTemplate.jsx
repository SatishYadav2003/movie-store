import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";

const MovieTemplate = ({
  movie_name,
  movie_category,
  movie_genre,
  movie_img_url,
  movie_rating,
  onClick,
}) => {
  const renderStars = (rating) => {
    const stars = [];
    const num = parseFloat(rating) || 0;
    const full = Math.floor(num);
    const hasHalf = num - full >= 0.4 && num - full <= 0.75;

    for (let i = 0; i < full; i++) {
      stars.push(
        <FaStar key={`full-${i}`} className="text-yellow-400 text-xs" />
      );
    }

    if (hasHalf) {
      stars.push(
        <FaStarHalfAlt key="half" className="text-yellow-400 text-xs" />
      );
    }

    while (stars.length < 5) {
      stars.push(
        <FaRegStar
          key={`empty-${stars.length}`}
          className="text-yellow-400 text-xs"
        />
      );
    }

    return stars;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="relative w-full bg-[#1a1a1a] rounded-xl shadow-md overflow-hidden cursor-pointer border border-transparent hover:shadow-pink-hover  transition-all  group duration-300"
    >
      {/* Movie Image */}
      <img
        src={movie_img_url}
        alt={movie_name}
        className="h-full w-full rounded-t-xl group-hover:scale-105 group-hover:brightness-[0.8] transition-transform duration-300"
      />

      {/* Hover Overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/30 backdrop-blur-[2px] px-4 py-5 flex flex-col justify-end">
        <h3 className="text-sm font-bold text-white truncate">{movie_name}</h3>
        <p className="text-xs text-gray-200 truncate">{movie_category}</p>
        <p className="text-xs text-gray-400 truncate italic">{movie_genre}</p>
        <div className="flex items-center gap-1 mt-1">
          {renderStars(movie_rating)}
          <span className="ml-1 text-gray-300 text-xs">{movie_rating}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieTemplate;
