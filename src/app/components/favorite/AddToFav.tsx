"use client";
import React, { useState } from "react";

interface AddToFavProps {
  movieId: number;
  title: string;
  image?: string;
  overview?: string;
  releaseDate?: string;
  voteCount?: number;
}

const AddToFav: React.FC<AddToFavProps> = ({
  movieId,
  title,
  image,
  overview,
  releaseDate,
  voteCount,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    // Save to localStorage or API later if needed
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        isFavorite
          ? "bg-red-600 text-white hover:bg-red-700"
          : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
      }`}
    >
      {isFavorite ? "★ Added to Favorites" : "☆ Add to Favorites"}
    </button>
  );
};

export default AddToFav;
