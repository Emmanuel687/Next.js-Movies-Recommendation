"use client";

// Imports Start
import React, { useEffect, useState } from "react";
import { getTrendingAllWeek, getTopRatedMovies, TmdbMovie } from "@/app/services/tmdb-api";
import MovieList from "@/app/components/movies/MovieList";
import MovieLoader from "@/app/components/custom/Loader";
// Imports End

// Type for props 
interface PageProps {
  params: Promise<{ genre: string }>;
}

const Home: React.FC<PageProps> = ({ params }) => {
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [error, setError] = useState<string | null>(null);

  const unwrappedParams = React.use(params);
  const genre = unwrappedParams.genre;

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const trending =
          genre === "rated"
            ? await getTopRatedMovies()
            : await getTrendingAllWeek();
        setResults(trending.results);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    loadTrending();
  }, [genre]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!results.length) return <div className="p-4">
    <MovieLoader />
  </div>;

  return (
    <div className="p-4">
      <MovieList results={results} />
    </div>
  );
};

export default Home;
