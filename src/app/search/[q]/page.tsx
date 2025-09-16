"use client";

import React, { useEffect, useState } from "react";
import { searchMovies, TmdbMovie } from "@/app/services/tmdb-api";
import MovieList from "@/app/components/movies/MovieList";

interface SearchResultsPageProps {
  params: Promise<{ q?: string }>;
}

const SearchResultsPage = ({ params }: SearchResultsPageProps) => {
  const [results, setResults] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const getQuery = async () => {
      const resolvedParams = await params;
      const searchQuery = resolvedParams?.q ?? "";
      setQuery(searchQuery);
    };
    getQuery();
  }, [params]);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await searchMovies(query);
        setResults(res.results || []);
      } catch (err) {
        setError("Failed to fetch search results.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Search results for:{" "}
        <span className="text-indigo-600">{decodeURIComponent(query)}</span>
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && results.length === 0 && <p>No results found</p>}
      {results.length > 0 && <MovieList results={results} />}
    </div>
  );
};

export default SearchResultsPage;