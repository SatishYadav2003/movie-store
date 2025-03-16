import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import MovieUpdateBorder from "../components/MovieUpdateBorder";
import MovieList from "../components/MovieList";

function HomePage({ user, handleLogout }) {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Navbar user={user} handleLogout={handleLogout} />
      <MovieUpdateBorder />
      <MovieList user={user} />
    </div>
  );
}

export default HomePage;
