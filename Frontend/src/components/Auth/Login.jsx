// import { useState, useEffect } from "react";
// import { signInWithGoogle } from "../../firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import { motion } from "framer-motion";
// import { auth } from "../../firebase/firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import toast from "react-hot-toast";
// import { AiOutlineClose } from "react-icons/ai";

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [userLoggedIn, setUserLoggedIn] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUserLoggedIn(true);
//         navigate("/");
//         const username = currentUser.displayName;
//         toast.success(`Welcome, ${username} to Movie4u`, {
//           style: {
//             textAlign: "center",
//           },
//         });
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   const handleLogin = async () => {
//     setLoading(true);
//     await signInWithGoogle();
//     setLoading(false);
//   };

//   const handleClickEvent = () => {
//     navigate("/");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 relative">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="bg-white p-6 py-12 sm:py-20 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm relative"
//       >
//         <button
//           className="absolute top-0 right-0 bg-white p-0.5 sm:p-1 rounded-2xl hover:bg-red-500 duration-300 hover:scale-105"
//           onClick={handleClickEvent}
//         >
//           <AiOutlineClose size={18} className="text-black hover:text-white" />
//         </button>

//         <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
//           Welcome to{" "}
//           <span className="text-blue-600 whitespace-nowrap">Movie4u</span> 🎬
//         </h2>

//         <motion.button
//           onClick={handleLogin}
//           disabled={loading || userLoggedIn}
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           className="flex items-center justify-center gap-2 w-[95%] sm:w-[90%] mx-auto  py-2 px-2 sm:py-2.5 text-sm sm:text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-70 transition-colors duration-200"
//         >
//           <span className="p-1.5 border-2 border-white rounded-full bg-white ">
//             <FcGoogle size={20} className="shrink-0" />
//           </span>
//           {loading ? "Signing in..." : "Sign in with Google"}
//         </motion.button>

//         <p className="mt-4 sm:mt-5 text-gray-600 text-xs sm:text-sm text-center leading-relaxed">
//           Sign in to explore & request your favorite movies! 🍿
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default Login;
import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { auth } from "../../firebase/firebaseConfig";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineClose } from "react-icons/ai";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Show stored error on page load
  useEffect(() => {
    const errorMsg = sessionStorage.getItem("login_error");
    if (errorMsg) {
      setLoginError(errorMsg);
      toast.error(errorMsg);
      sessionStorage.removeItem("login_error"); // Clear after showing
    }
  }, []);

  // Listen for login success
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        toast.success(`Welcome, ${currentUser.displayName}! 🎬`);
        sessionStorage.removeItem("login_error");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login error:", err);
      setLoginError(err.message);
      sessionStorage.setItem("login_error", err.message); // Store error
      toast.error(err.message); // Show error instantly
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 py-12 sm:py-20 rounded-2xl shadow-lg w-full max-w-xs sm:max-w-sm relative"
      >
        <button
          className="absolute top-0 right-0 bg-white p-0.5 sm:p-1 rounded-2xl hover:bg-red-500 duration-300 hover:scale-105"
          onClick={() => navigate("/")}
        >
          <AiOutlineClose size={18} className="text-black hover:text-white" />
        </button>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
          Welcome to <span className="text-blue-600 whitespace-nowrap">Movie4u</span> 🎬
        </h2>

        {loginError && <p className="text-red-600 text-sm text-center mb-2">{loginError}</p>}

        <motion.button
          onClick={handleLogin}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 w-[95%] sm:w-[90%] mx-auto py-2 px-2 sm:py-2.5 text-sm sm:text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-70 transition-colors duration-200"
        >
          <span className="p-1.5 border-2 border-white rounded-full bg-white">
            <FcGoogle size={20} className="shrink-0" />
          </span>
          {loading ? "Signing in..." : "Sign in with Google"}
        </motion.button>

        <p className="mt-4 sm:mt-5 text-gray-600 text-xs sm:text-sm text-center leading-relaxed">
          Sign in to explore & request your favorite movies! 🍿
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
