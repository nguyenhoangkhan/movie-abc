// KKPhim API Service - PhimAPI.com
const KKPHIM_BASE_URL = "https://phimapi.com";

export interface KKPhimMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  poster_url: string;
  thumb_url: string;
  year: number;
  content?: string;
  type?: string;
  status?: string;
  trailer_url?: string;
  time?: string;
  episode_current?: string;
  episode_total?: string;
  quality?: string;
  lang?: string;
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
      "accept-language": "en-US,en;q=0.5",
      "cache-control": "no-cache",
      origin: "https://nfsw.vercel.app",
      pragma: "no-cache",
      priority: "u=1, i",
      referer: "https://nfsw.vercel.app/",
      "sec-ch-ua": '"Chromium";v="140", "Not=A?Brand";v="24", "Brave";v="140"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "sec-gpc": "1",
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      Cookie: "ci_session=9geriqb5h53aenf8la39bvn3qitnlpm9",
    };
  }

  async getMovies(page: number = 1): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/danh-sach/phim-moi-cap-nhat?page=${page}`,
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
      console.error("Error fetching movies:", error);
      throw error;
    }
  }

  async getMoviesByCategory(category: string, page: number = 1): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/api/the-loai/${category}?page=${page}`,
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
      console.error("Error fetching movies by category:", error);
      throw error;
    }
  }

  async searchMovies(keyword: string, page: number = 1): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`,
        {
          headers: this.getHeaders(),
          next: { revalidate: 60 },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error searching movies:", error);
      throw error;
    }
  }

  async getMovieDetail(slug: string): Promise<KKPhimMovieDetail> {
    try {
      const response = await fetch(`${this.baseUrl}/phim/${slug}`, {
        headers: this.getHeaders(),
        next: { revalidate: 600 },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching movie detail:", error);
      throw error;
    }
  }

  convertToAppFormat(kkphimMovie: KKPhimMovie) {
    return {
      id: kkphimMovie._id,
      title: kkphimMovie.name,
      originalTitle: kkphimMovie.origin_name,
      description: kkphimMovie.content || "",
      thumbnail: kkphimMovie.poster_url,
      poster: kkphimMovie.thumb_url,
      year: kkphimMovie.year,
      rating: kkphimMovie.tmdb?.vote_average || 0,
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
      tmdb: kkphimMovie.tmdb,
      imdb: kkphimMovie.imdb?.id ? { id: kkphimMovie.imdb.id } : undefined,
    };
  }
}

export const kkphimService = new KKPhimService();
export default kkphimService;