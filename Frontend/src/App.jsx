import React from "react";
import HomePage from "./pages/HomePage";
import MovieProvider from "./contextApi/MovieProvider";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import IndividualMovieLister from "./components/IndividualMovieLister";
import TopMotion from "./components/TopMotion";

function App() {
  return (
    <div className="min-h-screen w-full bg-sky-100 overflow-hidden relative">
      <TopMotion />

      <Routes>
        <Route
          path="/"
          element={
            <MovieProvider>
              <HomePage />
            </MovieProvider>
          }
        />

        <Route path="/movie-detail" element={<IndividualMovieLister />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
