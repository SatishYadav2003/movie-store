import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { BASE_URL } from "../config.js";
import { AiOutlineClose } from "react-icons/ai";

function IndividualMovieLister() {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMovieLoading, setIsMovieLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingInModal, setLoadingInModal] = useState(true);

  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const openDownloadModal = queryParams.get("isDownload") === "true";
  const openMovieRoute = queryParams.get("isWatch") === "true";

  const handleWatchMovie = () => {
    navigate(
      `/movie-detail/${movie_id}/Watch?movieLink=${encodeURIComponent(
        movie.download_page_link
      )}`
    );
  };

  const handleDownload = (url, headers) => {
    const isVideoFile = /\.(mp4|mkv|avi|mov|flv|wmv)(\?.*)?$/i.test(url);

    if (isVideoFile) {
      const encodedHeaders = encodeURIComponent(JSON.stringify(headers));
      const downloadUrl =
        `${BASE_URL}/api/download?` +
        `url=${encodeURIComponent(url)}` +
        `&headers=${encodedHeaders}`;

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      window.location.href = url;
    }
  };

  const handleDownloadPage = async () => {
    setShowModal(true);
    setLoadingInModal(true);

    try {
      setIsLoading(true);
      const movie_link = movie.download_page_link;

      // Fetching the download links from your backend
      const response = await axios.get(
        `https://latest-link.onrender.com/get-download-links?url=${movie_link}`
      );

      console.log(response.data);

      setDownloadLinks(response.data.downloadLinks);
    } catch (error) {
      toast.error("Failed to fetch download links");
    } finally {
      setIsLoading(false);
      setLoadingInModal(false);
    }
  };

  useEffect(() => {
    if (!isMovieLoading && movie) {
      if (openDownloadModal) {
        handleDownloadPage();
        navigate(`/movie-detail/${movie.movie_id}`, { replace: true });
      }
    }
  }, [isMovieLoading, movie, openDownloadModal]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsMovieLoading(true);
        setError(null);

        const response = await axios.get(`${BASE_URL}/api/movies/${movie_id}`);
        setMovie(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Movie not found");
        } else {
          setError("Failed to fetch movie details");
        }
      } finally {
        setIsMovieLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movie_id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isMovieLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <ClipLoader color="#00bfff" loading={true} size={80} />
        <p className="text-center text-gray-400 text-xl mt-4">
          Just a sec, movie magic coming your way!
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black">
        <p className="text-2xl text-red-400 font-semibold">{error}</p>
        <p className="text-lg text-gray-500 mt-2">
          Oops! We couldn't find this movie.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-fit mb-5 mt-2 select-none max-md:mb-5 mx-auto ">
        <div className="text-5xl lg:text-6xl font-semibold text-white ">
          <span className="text-red-500">Movie</span>
          <span className="text-sky-500">4u</span>
        </div>
        <div className="text-pink-500 text-xs absolute right-0">
          No.1 Movie Platform
        </div>
      </div>

      <div className="relative flex flex-col justify-between select-none bg-black min-h-screen text-white">
        <div className="w-full bg-sky-500 my-4 text-center py-2 text-white">
          <span className="sm:text-xl font-semibold">
            {movie["Movie Name"]}
          </span>
        </div>

        <div className="mx-auto mb-6 w-44 sm:w-52 md:w-60 lg:w-72 flex-shrink-0">
          <img
            src={movie.movie_img_url}
            alt={movie["Movie Name"]}
            className="cursor-pointer w-full h-auto hover:scale-105 duration-300 rounded-lg shadow-lg shadow-sky-500"
          />
        </div>

        <div className="w-full bg-sky-500 my-4 text-center py-2 text-white select-none">
          <span className="sm:text-xl font-semibold">Movie Description</span>
        </div>

        <div className="w-full mb-4 sm:text-lg select-none bg-zinc-900 shadow-md rounded-md px-2 py-4">
          <p className="mb-4 text-pink-400 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Name :</span>{" "}
            {movie["Movie Name"]}
          </p>

          <p className="mb-4 text-fuchsia-400 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Description :</span>{" "}
            {movie["Movie Description"]}
          </p>

          <p className="text-red-400 mb-4 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Category :</span>{" "}
            {movie["Movie Category"]}
          </p>

          <p className="text-pink-400 mb-4 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Genre :</span>{" "}
            {movie.Genre}
          </p>

          <p className="text-orange-400 mb-4 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Release Date :</span>{" "}
            {movie["Release Date"]}
          </p>

          <p className="text-green-400 mb-4 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Starring :</span>{" "}
            {movie.Staring?.trim().replace(/,\s*$/, "")}
          </p>

          <p className="text-blue-400 mb-4 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Director :</span>{" "}
            {movie["Director:"].slice(0, -1).length === 0
              ? "Not Known"
              : movie["Director:"].slice(0, -1)}
          </p>

          <p className="text-yellow-400 mb-4 font-sans font-semibold">
            <span className="text-gray-300 font-bold">Rating :</span>{" "}
            {movie.Rating}
          </p>
        </div>

        <div className="w-full bg-sky-500 my-4 text-center py-2 text-white">
          <span className="sm:text-xl font-semibold">
            {movie["Movie Name"]} full movie download
          </span>
        </div>

        <div className="w-full flex flex-wrap justify-center gap-4 mb-6 px-4">
          <motion.button
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 1 }}
            onClick={handleDownloadPage}
            disabled={isLoading}
            className="relative flex justify-center items-center gap-2 bg-sky-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-sky-700
               flex-1 min-w-[200px] max-w-xs
               sm:flex-auto"
          >
            {isLoading && (
              <motion.div
                className="absolute flex justify-center items-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 20,
                  height: 20,
                  border: "4px solid transparent",
                  borderTopColor: "white",
                  borderRadius: "50%",
                }}
              />
            )}

            <span className={`${isLoading ? "opacity-0" : "opacity-100"}`}>
              Download Movie
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            transition={{ duration: 1 }}
            onClick={handleWatchMovie}
            className="relative flex justify-center items-center gap-2 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700
               flex-1 min-w-[200px] max-w-xs
               sm:flex-auto"
          >
            <motion.div />
            <span>Watch Movie</span>
          </motion.button>
        </div>
      </div>

      {/* Modal for download links */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4"
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-2xl p-6 sm:p-8"
          >
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-red-600 hover:text-red-800 text-2xl"
            >
              <AiOutlineClose />
            </button>

            <h2 className="text-xl font-semibold text-center mb-6">
              Choose Quality
            </h2>

            {loadingInModal ? (
              <div className="relative overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto pr-1">
                  {[1, 2, 3, 4].map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        opacity: 0,
                      }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                      className="bg-gray-800 p-4 rounded-md shadow-md h-28 animate-pulse"
                    >
                      <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/3 mb-2"></div>
                      <div className="h-8 bg-gray-700 rounded w-full"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                {downloadLinks.map((link, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-gray-800 p-4 rounded-md shadow text-white flex flex-col justify-between"
                  >
                    <p className="font-semibold text-sm mb-1">
                      {link.resolution}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Size: {link.size}
                    </p>
                    <button
                      onClick={() => handleDownload(link.url, link.headers)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-1.5 rounded-md"
                    >
                      Download
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default IndividualMovieLister;
