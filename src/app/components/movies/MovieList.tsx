// Imports Start
import React, { useState } from "react";
import MovieItem from "./MovieItem";
import Search from "../custom/Search";
import { TmdbMovie } from "@/app/services/tmdb-api";
// Imports End 


type MovieListProps = {
  results: TmdbMovie[];
};

const MovieList = ({ results }: MovieListProps) => {
  const [query, setQuery] = useState("");

  const filteredResults = results.filter((movie) =>
    (movie.title || movie.name || "")
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div>
    

      {/* Movie Grid Start */}
      <div
        className="
          grid 
          grid-cols-1 sm:grid-cols-1 
          md:grid-cols-2
          lg:grid-cols-3 
          xl:grid-cols-5 
          gap-3 sm:gap-4 md:gap-6
        "
      >
        {filteredResults.map((result) => (
          <MovieItem key={result.id} result={result} />
        ))}
      </div>
      {/* Movie Grid End */}
    </div>
  );
};

export default MovieList;
