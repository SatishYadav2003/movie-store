import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";
import axios from "axios";

const RequestMovie = ({ user, loading }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for form submission

  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    movieName: "",
    movieLanguage: "",
    reason: "",
  });

  const validate = () => {
    const errors = {};
    if (!formData.senderName.trim()) errors.senderName = "Name is required.";
    if (!formData.movieName.trim())
      errors.movieName = "Movie name is required.";
    if (!formData.movieLanguage.trim())
      errors.movieLanguage = "Movie language is required.";
    return errors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    setIsSubmitting(true); // Start loading

    try {
      const BASE_URL =
        import.meta.env.REACT_APP_BACKEND_BASE_URL ||
        "https://movie-store-backend.onrender.com";

      const response = await axios.post(
        `${BASE_URL}/api/send-request`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Your movie request has been submitted successfully!");
        setFormData({
          senderName: "",
          senderEmail: user?.email || "",
          movieName: "",
          movieLanguage: "",
          reason: "",
        });
      } else {
        toast.error(
          response.data.error || "Failed to send request. Try again later."
        );
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error(
        error.response?.data?.error || "Network error. Please try again."
      );
    } finally {
      setIsSubmitting(false); // Stop loading after request is complete
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, senderEmail: user.email }));
    }
  }, [user]);

  return loading ? (
    <div className="flex flex-col items-center justify-center h-screen px-4">
      <ClipLoader color="#3498db" loading={loading} size={60} />
      <p className="text-center text-gray-500 text-lg sm:text-xl mt-4">
        Loading your movie request portal... Hang tight! 🎬
      </p>
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl sm:max-w-lg mx-auto my-5 bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200 w-[90%] sm:w-[80%] md:w-[70%]"
    >
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800 uppercase tracking-wide">
        🎬 Request Your Favorite Movie!
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { label: "Your Name", name: "senderName" },
          { label: "Movie Name", name: "movieName" },
          { label: "Movie Language", name: "movieLanguage" },
        ].map(({ label, name }) => (
          <div key={name}>
            <input
              type="text"
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              className="w-full px-4 py-3 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            {errors[name] && (
              <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
            )}
          </div>
        ))}
        {/* Auto-filled & disabled email field */}
        <div>
          <input
            type="email"
            name="senderEmail"
            value={formData.senderEmail}
            disabled
            className="w-full px-4 py-3 text-sm sm:text-base border rounded-md bg-gray-100 cursor-not-allowed text-gray-500"
          />
        </div>
        <div>
          <textarea
            name="reason"
            placeholder="Why do you want this movie? (Optional)"
            value={formData.reason}
            onChange={handleChange}
            className="w-full p-3 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
        </div>

        {/* Submit Button with Loader */}
        <motion.button
          whileHover={!isSubmitting ? { scale: 1.05 } : {}}
          whileTap={!isSubmitting ? { scale: 0.95 } : {}}
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-white font-semibold text-base sm:text-lg rounded-md transition-all ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600"
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <ClipLoader color="#fff" size={20} />
              <span className="ml-2">Submitting...</span>
            </div>
          ) : (
            "Submit Request"
          )}
        </motion.button>

        {/* Go Back Button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          disabled={isSubmitting}
          className={`mt-6 w-full text-center py-3 font-medium border rounded-md transition-all ${
            isSubmitting
              ? "border-gray-400 text-gray-400 cursor-not-allowed"
              : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
          }`}
        >
          Go Back Home
        </button>
      </form>
    </motion.div>
  );
};

export default RequestMovie;
