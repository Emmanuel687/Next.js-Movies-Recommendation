"use client";

// Imports Start
import React, { useEffect, useState } from "react";
import { getTrendingAllWeek } from "./services/tmdb-api";
import MovieList from "./components/movies/MovieList";
// Imports End

const Home = () => {

  // State Variables Start
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  // State Variables End

  // Fetch trending movies on mount Start
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const trending = await getTrendingAllWeek();
        setResults(trending.results); // ✅ just the array
      } catch (err: any) {
        setError(err.message);
      }
    };

    loadTrending();
  }, []);
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
