import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

const RequestMovie = ({ user, loading }) => {
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    movieName: "",
    movieLanguage: "",
    reason: "",
  });

  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const validate = () => {
    const errors = {};
    if (!formData.senderName.trim()) errors.senderName = "Name is required.";
    if (!formData.senderEmail.trim()) {
      errors.senderEmail = "Email is required.";
    } else if (!isValidEmail(formData.senderEmail)) {
      errors.senderEmail = "Enter a valid email address.";
    }
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    console.log("Submitting request:", formData);
    toast.success("Your movie request has been submitted successfully!");

    setFormData({
      senderName: "",
      senderEmail: "",
      movieName: "",
      movieLanguage: "",
      reason: "",
    });
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  useEffect(()=>{
    window.scroll(0,0);
  },[])

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
          { label: "Your Email", name: "senderEmail", type: "email" },
          { label: "Movie Name", name: "movieName" },
          { label: "Movie Language", name: "movieLanguage" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <input
              type={type}
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 text-white font-semibold text-base sm:text-lg rounded-md bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 transition-colors"
        >
          Submit Request
        </motion.button>
      </form>

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/")}
        className="mt-6 w-full text-center py-3 text-blue-500 font-medium border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all"
      >
        Go Back Home
      </button>
    </motion.div>
  );
};

export default RequestMovie;
