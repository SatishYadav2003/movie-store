import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import MovieProvider from "./contextApi/MovieProvider";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import IndividualMovieLister from "./components/IndividualMovieLister";
import TopMotion from "./components/TopMotion";

import Login from "./components/Auth/Login";
import { auth } from "./firebase/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "firebase/auth";
import RequestMovie from "./components/RequestMovie";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(`Goodbye, ${user.displayName}!`);
      setUser(null);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-sky-100 overflow-hidden relative">
      <TopMotion />
      <div className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <MovieProvider>
                <HomePage user={user} handleLogout={handleLogout} />
              </MovieProvider>
            }
          />
          <Route
            path="/movie-detail/:movie_id"
            element={<IndividualMovieLister />}
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/request-movie"
            element={<RequestMovie user={user} loading={loading} />}
          />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
