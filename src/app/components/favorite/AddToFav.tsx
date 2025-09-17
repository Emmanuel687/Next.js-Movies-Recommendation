"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Heart, Trash2 } from "lucide-react";

interface AddToFavProps {
  movieId: number | string;
  title: string;
  image?: string;
  overview?: string;
  releaseDate?: string;
  voteCount?: number;
  className?: string;
  showLabel?: boolean;
  variant?: "default" | "minimal" | "card";
}

const AddToFav: React.FC<AddToFavProps> = ({
  movieId,
  title,
  image,
  overview,
  releaseDate,
  voteCount,
  className = "",
  showLabel = true,
  variant = "default",
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  // ✅ Always normalize to string
  const movieIdStr = String(movieId);

  const checkFavoriteStatus = async () => {
    if (!isSignedIn) {
      setIsFavorite(false);
      return;
    }

    try {
      // Normalize Clerk metadata
      const favs = Array.isArray(user?.publicMetadata?.favs)
        ? (user.publicMetadata.favs as (string | number)[]).map(String)
        : [];
      const isInMetadata = favs.includes(movieIdStr);

      setIsFavorite(isInMetadata);

      // Check DB
      const res = await fetch("/api/user/fav");
      if (res.ok) {
        const data = await res.json();
        const isInDB =
          data.favs?.some((fav: any) => String(fav.movieId) === movieIdStr) ||
          false;

        if (isInMetadata !== isInDB) {
          setIsFavorite(isInDB);
        }
      }
    } catch (err) {
      console.error("Error checking favorite status:", err);
    }
  };

  useEffect(() => {
    if (!isLoaded) return;
    setIsLoading(true);
    checkFavoriteStatus().finally(() => setIsLoading(false));
  }, [movieIdStr, isLoaded, isSignedIn, user]);

  const handleFavClick = async () => {
    setIsLoading(true);
    setError(null);

    if (!isSignedIn) {
      setIsLoading(false);
      router.push("/sign-in");
      return;
    }

    const previousState = isFavorite;
    setIsFavorite(!previousState); // optimistic toggle

    try {
      const res = await fetch("/api/user/fav", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          movieId: movieIdStr, // ✅ send as string
          title,
          overview,
          releaseDate,
          voteCount,
          image,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        if (data.action === "added") {
          setIsFavorite(true);
        } else if (data.action === "removed") {
          setIsFavorite(false);
        }

        await user?.reload(); // refresh Clerk metadata
      } else {
        setIsFavorite(previousState); // rollback
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || `Failed (${res.status})`);
      }
    } catch (error) {
      setIsFavorite(previousState); // rollback
      setError("Network error. Please try again.");
      console.error("Error updating favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Button styles
  const getButtonClass = () => {
    switch (variant) {
      case "minimal":
        return `p-2 rounded-full transition-all duration-200 ${
          isFavorite
            ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        } ${
          isLoading || !isLoaded
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-110 active:scale-95"
        }`;

      case "card":
        return `px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
          isFavorite
            ? "bg-red-600 text-white hover:bg-red-700 shadow-md"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        } ${
          isLoading || !isLoaded
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105 active:scale-95"
        }`;

      default:
        return `px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
          isFavorite
            ? "bg-red-600 text-white hover:bg-red-700 shadow-md"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        } ${
          isLoading || !isLoaded
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105 active:scale-95"
        }`;
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <button
        onClick={handleFavClick}
        disabled={isLoading || !isLoaded}
        className={getButtonClass()}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <div className="flex items-center justify-center gap-1.5">
          {isFavorite ? (
            variant === "minimal" ? (
              <Trash2 className="w-4 h-4" />
            ) : (
              <Heart className="w-4 h-4 fill-current" />
            )
          ) : (
            <Heart className="w-4 h-4" />
          )}

          {showLabel && (
            <span>
              {!isLoaded
                ? "..."
                : isLoading
                ? "Processing..."
                : isFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </span>
          )}
        </div>
      </button>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default AddToFav;
