const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

type CacheEntry = {
  data: any;
  expiry: number;
};

// Simple in-memory cache
const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

async function fetchFromTMDB(endpoint: string) {
  const separator = endpoint.includes("?") ? "&" : "?";
  const url = `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`;

  // ✅ Check cache
  if (cache[url] && cache[url].expiry > Date.now()) {
    return cache[url].data;
  }

  const res = await fetch(url, { next: { revalidate: 300 } }); // optional cache hint
  if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

  const data = await res.json();

  // ✅ Save in cache
  cache[url] = {
    data,
    expiry: Date.now() + CACHE_DURATION,
  };

  return data;
}

// -----------------------------
// API Calls
// -----------------------------

export function getTrendingAllWeek(page: number = 1) {
  return fetchFromTMDB(`/trending/all/week?language=en-US&page=${page}`);
}

export function getTopRatedMovies(page: number = 1) {
  return fetchFromTMDB(`/movie/top_rated?language=en-US&page=${page}`);
}

export function getMovieById(id: number) {
  return fetchFromTMDB(`/movie/${id}?language=en-US`);
}
