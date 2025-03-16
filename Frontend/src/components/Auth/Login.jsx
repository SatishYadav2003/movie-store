import { useState, useEffect } from "react";
import { signInWithGoogle } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { auth } from "../../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserLoggedIn(true);
        navigate("/");  // ✅ Ensure navigation happens when auth state updates
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md text-center"
      >
        <h2 className="text-2xl font-bold mb-4">
          Welcome to <span className="text-blue-500">Movie4U</span> 🎬
        </h2>

        <motion.button
          onClick={handleLogin}
          disabled={loading || userLoggedIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 w-full py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md disabled:opacity-70"
        >
          <div className="p-1 border-2 border-white rounded-full bg-white">
            <FcGoogle size={22} />
          </div>
          {loading ? "Signing in..." : "Sign in with Google"}
        </motion.button>

        <p className="mt-3 text-gray-500 text-sm">
          Sign in to explore & request your favorite movies! 🍿
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
