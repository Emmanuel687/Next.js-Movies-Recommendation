import React from "react";
import Image from "next/image";
import Link from "next/link";
import Card from "../custom/Card";
import { ThumbsUp, ArrowRightCircle } from "lucide-react";

// Define the movie type
export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
}

// Define props type
type MovieItemProps = {
  result: TmdbMovie;
};

const MovieItem = ({ result }: MovieItemProps) => {
  const imageUrl = result.poster_path
    ? `https://image.tmdb.org/t/p/w500${result.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <Card className="group overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:rotate-[0.3deg] hover:shadow-2xl dark:hover:shadow-indigo-900/40">
      <div className="relative w-full h-72 rounded-t-xl overflow-hidden">
        <Image
          src={imageUrl}
          alt={result.title || result.name || "Untitled"}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        {typeof result.vote_average === "number" && (
          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium text-white shadow">
            <span>{result.vote_average.toFixed(1)}</span>
            <ThumbsUp className="w-3.5 h-3.5 text-green-400" />
          </div>
        )}

        {result.release_date && (
          <div className="absolute bottom-3 left-3 bg-white/80 dark:bg-gray-900/70 text-gray-900 dark:text-gray-200 text-[11px] font-semibold px-2 py-0.5 rounded-full shadow">
            {new Date(result.release_date).getFullYear()}
          </div>
        )}

        <Link
          href={`/movie/${result.id}`}
          className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 flex items-center justify-center"
          aria-label={`View details for ${result.title || result.name || "movie"}`}
        >
          <ArrowRightCircle className="w-5 h-5" />
        </Link>
      </div>

      <Link href={`/movie/${result.id}`}>
        <div className="p-4 space-y-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {result.title || result.name || "Untitled"}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {result.overview || "No description available."}
          </p>
        </div>
      </Link>
    </Card>
  );
};

export default MovieItem;
