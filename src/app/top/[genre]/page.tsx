"use client";

// Imports Start
import React, { useEffect, useState } from "react";
import { getTrendingAllWeek, getTopRatedMovies } from "@/app/services/tmdb-api";
import MovieList from "@/app/components/movies/MovieList";
// Imports End

const Home = ({ params }) => {
  // State Variables Start
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  // State Variables End

  // Unwrap params with React.use() - NEW APPROACH
  const unwrappedParams = React.use(params);
  const genre = unwrappedParams.genre;

  // Fetch trending movies on mount Start
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const trending =
          genre === "rated"
            ? await getTopRatedMovies()
            : await getTrendingAllWeek();
        setResults(trending.results);
      } catch (err) {
        setError(err.message);
      }
    };

    loadTrending();
  }, [genre]);
  // Fetch trending movies on mount End

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!results.length) return <div className="p-4">Loading...</div>;

  return (
    // Movie List Component Start
    <div className="p-4">
      <MovieList results={results} />
    </div>
    // Movie List Component End
  );
};

export default Home;