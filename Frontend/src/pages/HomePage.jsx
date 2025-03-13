import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieUpdateBorder from "../components/MovieUpdateBorder";
import MovieList from "../components/MovieList";

function HomePage() {
  useEffect(() => {
    window.history.scrollRestoration = "manual"; 
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div>
      <Navbar />
      <MovieUpdateBorder />
      <MovieList />
    </div>
  );
}

export default HomePage;
