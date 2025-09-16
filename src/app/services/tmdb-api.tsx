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
}

interface TrendingResponse {
  results: TmdbMovie[];
  page: number;
  total_pages: number;
  total_results: number;
}

interface CacheEntry {
  data: TrendingResponse | TmdbMovie;
  expiry: number;
}

// -----------------------------
// Cache
// -----------------------------
const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

async function fetchFromTMDB(endpoint: string): Promise<TrendingResponse | TmdbMovie> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;

  // Check cache
  if (cache[url] && cache[url].expiry > Date.now()) {
    return cache[url].data;
  }

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

  const data = await res.json();

  cache[url] = { data, expiry: Date.now() + CACHE_DURATION };
  return data;
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
  return fetchFromTMDB(`/movie/${id}?language=en-US`) as Promise<TmdbMovie>;
}

// ✅ NEW: Search by term
export function searchMovies(query: string, page: number = 1): Promise<TrendingResponse> {
  return fetchFromTMDB(
    `/search/movie?language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
  ) as Promise<TrendingResponse>;
}
