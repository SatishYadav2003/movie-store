import React from "react";
import HomePage from "./pages/HomePage";
import MovieProvider from "./contextApi/MovieProvider";
import { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import IndividualMovieLister from "./components/IndividualMovieLister";
import TopMotion from "./components/TopMotion";
import BoundryBorder from "./components/BoundryBorder";

function App() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-sky-100 overflow-hidden relative">
      <TopMotion />

      {/* Main content - This grows to push footer down */}
      <div className="flex-1">
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
      </div>

      {/* Toast notifications */}
      <Toaster />

      {/* Footer - Always at the bottom */}
      <BoundryBorder />
    </div>
  );
}

export default App;