import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { kkphimService } from "@/lib/kkphim";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const genre = searchParams.get("genre");
    const search = searchParams.get("search");
    const type = searchParams.get("type"); // phim-le, phim-bo, tv-shows, hoat-hinh
    const isAdult = searchParams.get("adult") === "true";

    const session = await getServerSession(authOptions);

    // Adult content requires authentication
    if (isAdult && !session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required for adult content" },
        { status: 401 }
      );
    }

    let kkphimResponse;

    try {
      // Determine which API call to make based on parameters
      if (search) {
        // Search movies
        kkphimResponse = await kkphimService.searchMovies(search, page, limit);
      } else if (genre) {
        // Get movies by category
        kkphimResponse = await kkphimService.getMoviesByCategory(
          genre,
          page,
          limit
        );
      } else if (type) {
        // Get movies by type
        kkphimResponse = await kkphimService.getMoviesByType(type, page, limit);
      } else {
        // Get popular/latest movies
        kkphimResponse = await kkphimService.getMovies(page, limit);
      }

      if (!kkphimResponse.status) {
        throw new Error(
          kkphimResponse.msg || "Failed to fetch movies from KKPhim"
        );
      }

      // Convert KKPhim movies to our app format
      const movies = kkphimResponse.items.map((movie) =>
        kkphimService.convertToAppFormat(movie)
      );

      // Filter adult content if not authenticated
      const filteredMovies = isAdult
        ? movies
        : movies.filter((movie) => !movie.isAdult);

      // Get pagination info from KKPhim response
      const pagination = kkphimResponse.pagination;

      return NextResponse.json({
        success: true,
        data: {
          movies: filteredMovies,
          pagination: {
            page: pagination?.currentPage || page,
            limit: pagination?.totalItemsPerPage || limit,
            total: pagination?.totalItems || filteredMovies.length,
            totalPages:
              pagination?.totalPages ||
              Math.ceil(filteredMovies.length / limit),
            hasNext: pagination
              ? pagination.currentPage < pagination.totalPages
              : false,
            hasPrev: pagination ? pagination.currentPage > 1 : page > 1,
          },
          source: "kkphim",
          message: kkphimResponse.msg,
        },
      });
    } catch (kkphimError) {
      console.error("KKPhim API error:", kkphimError);

      // Fallback: return empty result with error message
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch movies from external source",
          data: {
            movies: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
              hasNext: false,
              hasPrev: false,
            },
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Movies fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
