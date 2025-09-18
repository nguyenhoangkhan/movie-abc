import { NextRequest, NextResponse } from "next/server";
import { kkphimService } from "@/lib/kkphim";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Movie slug is required" },
        { status: 400 }
      );
    }

    const movieDetail = await kkphimService.getMovieDetail(slug);

    if (!movieDetail.status) {
      return NextResponse.json(
        { success: false, error: movieDetail.msg || "Movie not found" },
        { status: 404 }
      );
    }

    // Convert to our app format
    const movie = kkphimService.convertToAppFormat(movieDetail.movie);

    return NextResponse.json({
      success: true,
      data: {
        movie: {
          ...movie,
          episodes: movieDetail.movie.episodes,
        },
        source: "kkphim",
      },
    });
  } catch (error) {
    console.error("Movie detail fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
