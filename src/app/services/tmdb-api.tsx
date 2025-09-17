const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// -----------------------------
// Types
// -----------------------------
export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  backdrop_path?: string;
  first_air_date?: string;
  vote_count?: number;
  tagline?: string;
  homepage?: string;
  budget?: number;
  revenue?: number;
  status?: string;
  genres?: Array<{ id: number; name: string }>;
  production_companies?: ProductionCompany[];
  belongs_to_collection?: Collection;
  spoken_languages?: Array<{ iso_639_1: string; english_name: string }>;
  credits?: {
    cast?: MovieCast[];
    crew?: MovieCrew[];
  };
  runtime?: number;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path?: string;
}

interface Collection {
  id: number;
  name: string;
  poster_path?: string;
}

interface MovieCast {
  id: number;
  name: string;
  character?: string;
  profile_path?: string;
}

interface MovieCrew {
  id: number;
  name: string;
  job: string;
  profile_path?: string;
}

interface TrendingResponse {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

interface CacheEntry {
  data: any;
  expiry: number;
}

// -----------------------------
// Cache
// -----------------------------
const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

async function fetchFromTMDB(endpoint: string): Promise<any> {
  // Validate API key
  if (!API_KEY) {
    throw new Error('TMDB API key is missing. Please set NEXT_PUBLIC_API_KEY environment variable.');
  }

  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;

  // Check cache
  if (cache[url] && cache[url].expiry > Date.now()) {
    return cache[url].data;
  }

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    
    if (!res.ok) {
      // Try to get more detailed error information
      let errorMessage = `Failed to fetch: ${res.status} ${res.statusText}`;
      
      try {
        const errorData = await res.json();
        if (errorData.status_message) {
          errorMessage = `TMDB API Error: ${errorData.status_message}`;
        }
      } catch (e) {
        // If we can't parse JSON, use the default error message
      }
      
      throw new Error(errorMessage);
    }

    const data = await res.json();
    cache[url] = { data, expiry: Date.now() + CACHE_DURATION };
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API call failed for ${url}:`, error.message);
      throw error;
    }
    throw new Error('Unknown error occurred during API call');
  }
}

// -----------------------------
// API Calls
// -----------------------------
export function getTrendingAllWeek(page: number = 1): Promise<TrendingResponse> {
  return fetchFromTMDB(`/trending/all/week?language=en-US&page=${page}`) as Promise<TrendingResponse>;
}

export function getTopRatedMovies(page: number = 1): Promise<TrendingResponse> {
  return fetchFromTMDB(`/movie/top_rated?language=en-US&page=${page}`) as Promise<TrendingResponse>;
}

export function getMovieById(id: number): Promise<TmdbMovie> {
  return fetchFromTMDB(`/movie/${id}?language=en-US&append_to_response=credits`) as Promise<TmdbMovie>;
}

// Search by term
export function searchMovies(query: string, page: number = 1): Promise<TrendingResponse> {
  return fetchFromTMDB(
    `/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  ) as Promise<TrendingResponse>;
}