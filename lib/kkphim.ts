// KKPhim API Service
// API Documentation: https://kkphim.vip/

const KKPHIM_BASE_URL = "https://phimapi.com";

// Types for KKPhim API response - Updated based on actual API
export interface KKPhimMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  // Optional fields that may be present in detailed views
  content?: string;
  type?: string;
  status?: string;
  is_copyright?: boolean;
  sub_docquyen?: boolean;
  chieurap?: boolean;
  trailer_url?: string;
  time?: string;
  episode_current?: string;
  episode_total?: string;
  quality?: string;
  lang?: string;
  notify?: string;
  showtimes?: string;
  view?: number;
  actor?: string[];
  director?: string[];
  category?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  country?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  created?: {
    time: string;
  };
  modified?: {
    time: string;
  };
  tmdb?: {
    type: string;
    id: string;
    season?: number;
    vote_average: number;
    vote_count: number;
  };
  imdb?: {
    id: string | null;
  };
}

export interface KKPhimResponse {
  status: boolean;
  msg: string;
  items: KKPhimMovie[];
  pagination: {
    totalItems: number;
    totalItemsPerPage: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface KKPhimMovieDetail {
  status: boolean;
  msg: string;
  movie: KKPhimMovie & {
    episodes: Array<{
      server_name: string;
      server_data: Array<{
        name: string;
        slug: string;
        filename: string;
        link_embed: string;
        link_m3u8: string;
      }>;
    }>;
  };
}

class KKPhimService {
  private baseUrl = KKPHIM_BASE_URL;

  private getHeaders() {
    return {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.8",
      "cache-control": "no-cache",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    };
  }

  // Get popular movies (danh sách phim)
  async getMovies(
    page: number = 1,
    limit: number = 12
  ): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/danh-sach/phim-moi-cap-nhat?page=${page}`,
        {
          headers: this.getHeaders(),
          next: { revalidate: 300 }, // Cache for 5 minutes
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching movies from KKPhim:", error);
      throw error;
    }
  }

  // Get movies by category
  async getMoviesByCategory(
    category: string,
    page: number = 1,
    limit: number = 12
  ): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/api/the-loai/${category}?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
          next: { revalidate: 300 },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching movies by category from KKPhim:", error);
      throw error;
    }
  }

  // Search movies
  async searchMovies(
    keyword: string,
    page: number = 1,
    limit: number = 12
  ): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/api/tim-kiem?keyword=${encodeURIComponent(
          keyword
        )}&page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
          next: { revalidate: 60 }, // Cache search for 1 minute
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error searching movies from KKPhim:", error);
      throw error;
    }
  }

  // Get movie detail
  async getMovieDetail(slug: string): Promise<KKPhimMovieDetail> {
    try {
      const response = await fetch(`${this.baseUrl}/phim/${slug}`, {
        headers: this.getHeaders(),
        next: { revalidate: 600 }, // Cache for 10 minutes
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching movie detail from KKPhim:", error);
      throw error;
    }
  }

  // Get movies by type (phim-le, phim-bo, tv-shows, hoat-hinh)
  async getMoviesByType(
    type: string,
    page: number = 1,
    limit: number = 12
  ): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/api/danh-sach/${type}?page=${page}&limit=${limit}`,
        {
          headers: this.getHeaders(),
          next: { revalidate: 300 },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching movies by type from KKPhim:", error);
      throw error;
    }
  }

  // Convert KKPhim movie to our app format
  convertToAppFormat(kkphimMovie: KKPhimMovie) {
    return {
      id: kkphimMovie._id,
      title: kkphimMovie.name,
      originalTitle: kkphimMovie.origin_name,
      description: kkphimMovie.content || "",
      thumbnail: kkphimMovie.poster_url,
      poster: kkphimMovie.thumb_url,
      year: kkphimMovie.year,
      rating: kkphimMovie.view ? Math.min(kkphimMovie.view / 10000, 10) : 0, // Convert view count to rating (rough estimation)
      genre: kkphimMovie.category?.map((cat) => cat.name) || [],
      duration: kkphimMovie.time || "",
      status: kkphimMovie.status || "",
      type: kkphimMovie.type || "",
      quality: kkphimMovie.quality || "",
      language: kkphimMovie.lang || "",
      country: kkphimMovie.country?.map((c) => c.name) || [],
      director: kkphimMovie.director || [],
      actors: kkphimMovie.actor || [],
      trailerUrl: kkphimMovie.trailer_url || "",
      slug: kkphimMovie.slug,
      episodeCurrent: kkphimMovie.episode_current || "",
      episodeTotal: kkphimMovie.episode_total || "",
      view: kkphimMovie.view || 0,
      isAdult: false, // KKPhim doesn't seem to have explicit adult content flag
      createdAt: kkphimMovie.created?.time || "",
      updatedAt: kkphimMovie.modified?.time || "",
    };
  }
}

export const kkphimService = new KKPhimService();
export default kkphimService;
