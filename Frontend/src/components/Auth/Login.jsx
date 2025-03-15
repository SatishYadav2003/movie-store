import { useState } from "react";
import { signInWithGoogle } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const user = await signInWithGoogle();
    if (user) {
      setUser(user);
      navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br bg-white text-white p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md text-center text-gray-900"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">
          Welcome to <span className="text-blue-500">MovieStore</span> 🎬
        </h2>

        <motion.button
          onClick={handleLogin}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-2 sm:gap-3 w-full py-2 sm:py-2.5 text-sm sm:text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all disabled:opacity-70"
        >
          <div className="p-1 border-2 border-white rounded-full bg-white">
            <FcGoogle size={22} />
          </div>
          {loading ? "Signing in..." : "Sign in with Google"}
        </motion.button>

        <p className="mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm">
          Sign in to explore & request your favorite movies! 🍿
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
