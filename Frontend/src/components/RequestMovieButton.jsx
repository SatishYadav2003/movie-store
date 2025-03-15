import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const RequestMovieButton = ({ user }) => {
  const navigate = useNavigate();

  const handleRequestClick = () => {
    if (user) {
      navigate("/request-movie");
    } else {
      toast.error("You must log in first to request a movie!");
    }
  };

  return (
    <div className="flex items-center justify-center mx-2 my-2">
      <motion.button
        onClick={handleRequestClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base md:text-lg lg:text-xl text-white bg-blue-500 hover:bg-blue-600 transition-all rounded-lg shadow-lg font-semibold "
      >
        Request Your Favorite Movies! 🍿
      </motion.button>
    </div>
  );
};

export default RequestMovieButton;
