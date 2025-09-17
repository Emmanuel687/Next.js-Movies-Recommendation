"use client";

import React from 'react'
import MovieList from "@/app/components/movies/MovieList"
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface Movie {
  movieId: number;
  title: string;
  description: string;
  dateReleased: string;
  rating: number;
  image: string;
}

const Favorites = () => {
  const [results, setResults] = useState<Movie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      // Wait for Clerk to load
      if (!isLoaded) return

      // Redirect if not signed in
      if (!isSignedIn) {
        router.push('/sign-in')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch('/api/user/fav', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch favorites: ${res.status}`)
        }

        const data = await res.json()
        setResults(data.favs || [])
      } catch (err) {
        console.error('Error fetching favorites:', err)
        setError(err instanceof Error ? err.message : 'Failed to load favorites')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isLoaded, isSignedIn, router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Empty favorites state
  if (results.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-gray-400 text-6xl mb-4">💫</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            No favorites yet!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start exploring movies and add them to your favorites to see them here.
          </p>
          <button 
            onClick={() => router.push('/movies')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors font-medium"
          >
            Browse Movies
          </button>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Favorites
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {results.length} movie{results.length !== 1 ? 's' : ''} in your collection
        </p>
      </div>

      <MovieList 
        results={results.map(movie => ({
          id: movie.movieId,
          title: movie.title,
          overview: movie.description,
          release_date: movie.dateReleased,
          vote_average: movie.rating,
          poster_path: movie.image,
        }))} 
      />
    </div>
  )
}

export default Favorites