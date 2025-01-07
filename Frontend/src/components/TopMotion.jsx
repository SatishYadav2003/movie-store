import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";

function TopMotion() {
  const [isVisible, setIsVisible] = useState(false);

  const handleTopMotion = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleVisibility = () => {
    if (window.scrollY > 10) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div
      onClick={handleTopMotion}
      className={`z-50 bg-blue-600 hover:bg-blue-700 max-sm:w-9 max-sm:h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full fixed bottom-5 right-5 flex items-center justify-center shadow-lg cursor-pointer transition-all transform hover:scale-110 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
      title="Go to Top"
    >
      <FaArrowUp className="text-white text-xl" />
    </div>
  );
}

export default TopMotion;
