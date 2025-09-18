// KKPhim API Service
// API Documentation: https://kkphim.vip/

const KKPHIM_BASE_URL = "https://phimapi.com";

// Types for KKPhim API response
export interface KKPhimMovie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  content: string;
  type: string;
  status: string;
  poster_url: string;
  thumb_url: string;
  is_copyright: boolean;
  sub_docquyen: boolean;
  chieurap: boolean;
  trailer_url: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  notify: string;
  showtimes: string;
  year: number;
  view: number;
  actor: string[];
  director: string[];
  category: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  country: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  created: {
    time: string;
  };
  modified: {
    time: string;
  };
}

export interface KKPhimResponse {
  status: boolean;
  msg: string;
  data: {
    seoOnPage: {
      og_type: string;
      titleHead: string;
      descriptionHead: string;
      og_image: string[];
      og_url: string;
    };
    breadCrumb: Array<{
      name: string;
      slug?: string;
      isCurrent?: boolean;
    }>;
    titlePage: string;
    items: KKPhimMovie[];
    params: {
      type_slug: string;
      filterCategory: string[];
      filterCountry: string[];
      filterYear: string;
      filterType: string;
      sortField: string;
      sortType: string;
      pagination: {
        totalItems: number;
        totalItemsPerPage: number;
        currentPage: number;
        totalPages: number;
      };
    };
    type_list: string;
    APP_DOMAIN_FRONTEND: string;
    APP_DOMAIN_CDN_IMAGE: string;
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

  // Get popular movies (danh sách phim)
  async getMovies(
    page: number = 1,
    limit: number = 12
  ): Promise<KKPhimResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/danh-sach/phim-moi-cap-nhat?page=${page}&limit=${limit}`,
        {
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
      description: kkphimMovie.content,
      thumbnail: kkphimMovie.poster_url,
      poster: kkphimMovie.thumb_url,
      year: kkphimMovie.year,
      rating: Math.min(kkphimMovie.view / 10000, 10), // Convert view count to rating (rough estimation)
      genre: kkphimMovie.category.map((cat) => cat.name),
      duration: kkphimMovie.time,
      status: kkphimMovie.status,
      type: kkphimMovie.type,
      quality: kkphimMovie.quality,
      language: kkphimMovie.lang,
      country: kkphimMovie.country.map((c) => c.name),
      director: kkphimMovie.director,
      actors: kkphimMovie.actor,
      trailerUrl: kkphimMovie.trailer_url,
      slug: kkphimMovie.slug,
      episodeCurrent: kkphimMovie.episode_current,
      episodeTotal: kkphimMovie.episode_total,
      view: kkphimMovie.view,
      isAdult: false, // KKPhim doesn't seem to have explicit adult content flag
      createdAt: kkphimMovie.created.time,
      updatedAt: kkphimMovie.modified.time,
    };
  }
}

export const kkphimService = new KKPhimService();
export default kkphimService;
