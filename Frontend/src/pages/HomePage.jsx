import React from "react";
import Navbar from "../components/Navbar";
import MovieUpdateBorder from "../components/MovieUpdateBorder";
import MovieList from "../components/MovieList";

function HomePage() {
  return (
    <div>
      <Navbar />
      <MovieUpdateBorder />
      <MovieList />
    </div>
  );
}

export default HomePage;
