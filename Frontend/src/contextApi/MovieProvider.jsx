import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config";

const movieContext = createContext();

function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]); // Stores filtered movies
  const [allMovies, setAllMovies] = useState([]); // Stores all movies once

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/filter_movies`);
        setAllMovies(response.data);
        setMovies(response.data); // Initialize movies with all movies
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Handle search filter
  const handleSetMovie = (inpValue) => {
    const lowerInpValue = inpValue.toLowerCase();

    if (lowerInpValue === "") {
      setMovies(allMovies); // Reset movies when input is empty
    } else {
      const filterMovies = allMovies.filter((movie) =>
        movie["Movie Name"].toLowerCase().includes(lowerInpValue)
      );
      setMovies(filterMovies);
    }
  };

  return (
    <movieContext.Provider value={[handleSetMovie, movies]}>
      {children}
    </movieContext.Provider>
  );
}

export const useMovieResult = () => useContext(movieContext);

export default MovieProvider;
