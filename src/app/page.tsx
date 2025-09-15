"use client";

// Imports Start
import React, { useEffect, useState } from "react";
import { getTrendingAllWeek } from "./services/tmdb-api";
import MovieList from "./components/movies/MovieList";
// Imports End

// Define proper TypeScript interfaces
interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
}

interface TrendingResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

const Home = () => {
  // State Variables Start - Replace any with proper types
  const [results, setResults] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  // State Variables End

  // Fetch trending movies on mount Start
  useEffect(() => {
    const loadTrending = async () => {
      try {
        const trending = await getTrendingAllWeek() as TrendingResponse;
        setResults(trending.results);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
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