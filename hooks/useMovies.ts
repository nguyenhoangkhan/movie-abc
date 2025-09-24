// Custom hooks for API calls using React Query
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
interface Movie {
  id: string;
  title: string;
  description?: string | null;
  poster?: string | null;
  backdrop?: string | null;
  releaseDate?: Date | null;
  rating?: number | null;
  genre: string[];
  isAdult: boolean;
  slug?: string;
  year?: number;
  duration?: string;
  quality?: string;
  type?: string;
  thumbnail?: string;
}

interface MovieDetail extends Movie {
  originalTitle?: string;
  status?: string;
  episodeCurrent?: string;
  episodeTotal?: string;
  view?: number;
  country: string[];
  director: string[];
  actors: string[];
  trailerUrl?: string;
  videoSources?: { quality: string; url: string }[];
  episodes?: Array<{
    name: string;
    slug: string;
    filename: string;
    link_embed: string;
    link_m3u8: string;
  }>;
  recommendedMovies?: Movie[];
  tmdbInfo?: {
    type: string;
    id: string;
    season?: number;
    vote_average: number;
    vote_count: number;
  };
  tmdb?: {
    type: string;
    id: string;
    season?: number;
    vote_average: number;
    vote_count: number;
  };
  imdbInfo?: {
    id: string;
  };
}

interface WatchData {
  videoUrl: string | null;
  resolution: string | null;
  availableResolutions: string[];
  videoType: string | null;
  hasVideo: boolean;
  message?: string;
  movie: MovieDetail;
  episodes?: any[];
  currentEpisode?: any;
  serverInfo?: {
    name: string;
    totalServers: number;
  };
}

// Query Keys
export const queryKeys = {
  movies: {
    all: ["movies"] as const,
    lists: () => [...queryKeys.movies.all, "list"] as const,
    list: (page: number, genre?: string, search?: string, adult?: boolean) =>
      [...queryKeys.movies.lists(), { page, genre, search, adult }] as const,
    details: () => [...queryKeys.movies.all, "detail"] as const,
    detail: (slug: string) => [...queryKeys.movies.details(), slug] as const,
  },
  watch: {
    all: ["watch"] as const,
    video: (movieSlug: string, resolution?: string, episode?: string) =>
      [...queryKeys.watch.all, { movieSlug, resolution, episode }] as const,
  },
};

// API Functions
const fetchMovies = async (
  page: number = 1,
  genre?: string,
  search?: string,
  adult?: boolean
): Promise<{ movies: Movie[]; totalPages: number; currentPage: number }> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "12",
  });

  if (search) params.append("search", search);
  if (genre) params.append("genre", genre);
  if (adult) params.append("adult", "true");

  const response = await fetch(`/api/movies?${params}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch movies");
  }

  return data.data;
};

const fetchMovieDetail = async (slug: string): Promise<MovieDetail> => {
  const response = await fetch(`/api/movies/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch movie detail: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch movie detail");
  }

  return data.data;
};

const fetchWatchData = async (
  movieSlug: string,
  resolution: string = "720p",
  episode?: string
): Promise<WatchData> => {
  // Build query string for GET request
  const params = new URLSearchParams();
  if (resolution) params.append("resolution", resolution);
  if (episode) params.append("episode", episode);

  const queryString = params.toString();
  const url = `/api/watch/${movieSlug}${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch watch data: ${response.statusText}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.error || "Failed to fetch watch data");
  }

  return data.data;
};

// Custom Hooks

// Fetch movies list with filtering
export const useMovies = (
  page: number = 1,
  genre?: string,
  search?: string,
  adult?: boolean
) => {
  return useQuery({
    queryKey: queryKeys.movies.list(page, genre, search, adult),
    queryFn: () => fetchMovies(page, genre, search, adult),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    placeholderData: (previousData) => previousData, // Keep previous data while loading
  });
};

// Fetch single movie detail
export const useMovieDetail = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.movies.detail(slug),
    queryFn: () => fetchMovieDetail(slug),
    enabled: !!slug, // Only run if slug exists
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Fetch watch/video data
export const useWatchData = (
  movieSlug: string,
  resolution: string = "720p",
  episode?: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: queryKeys.watch.video(movieSlug, resolution, episode),
    queryFn: () => fetchWatchData(movieSlug, resolution, episode),
    enabled: enabled && !!movieSlug, // Only run if enabled and movieSlug exists
    staleTime: 1 * 60 * 1000, // 1 minute (video URLs may expire quickly)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry 404s (movie not found)
      if (error?.message?.includes("404")) return false;
      return failureCount < 2;
    },
  });
};

// Mutation for watch data (if we need to trigger manually)
export const useWatchMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      movieSlug,
      resolution,
      episode,
    }: {
      movieSlug: string;
      resolution?: string;
      episode?: string;
    }) => fetchWatchData(movieSlug, resolution, episode),
    onSuccess: (data, variables) => {
      // Cache the successful result
      queryClient.setQueryData(
        queryKeys.watch.video(
          variables.movieSlug,
          variables.resolution,
          variables.episode
        ),
        data
      );
    },
  });
};

// Prefetch movie detail (useful for hover states)
export const usePrefetchMovieDetail = () => {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: queryKeys.movies.detail(slug),
      queryFn: () => fetchMovieDetail(slug),
      staleTime: 10 * 60 * 1000,
    });
  };
};

// Invalidate queries (useful for refresh)
export const useInvalidateMovies = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.movies.all });
  };
};
