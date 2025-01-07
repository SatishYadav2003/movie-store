import React, { createContext, useContext, useState } from "react";
import movie_list from "../movielist/compiled_movie_details.json"

const movieContext = createContext();

function MovieProvider({ children }) {

    const [movies,setMovies] = useState(movie_list)

    const handleSetMovie = (inpValue)=>{
        const lowerInpValue = inpValue.toLowerCase()

        const filterMovies = movie_list.filter(movie=>{
            return movie["Movie Name"].toLowerCase().includes(lowerInpValue)
        })

        setMovies(filterMovies)
    }



  return <movieContext.Provider value={[handleSetMovie,movies]}>{children}</movieContext.Provider>;
}


export const useMovieResult = ()=>useContext(movieContext)

export default MovieProvider;
