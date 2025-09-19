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

    // Extract episodes data
    let episodes: any[] = [];
    let videoSources: { quality: string; url: string }[] = [];

    if (movieDetail.movie.episodes && movieDetail.movie.episodes.length > 0) {
      const firstServer = movieDetail.movie.episodes[0];
      if (firstServer.server_data && firstServer.server_data.length > 0) {
        episodes = firstServer.server_data.map((ep: any) => ({
          name: ep.name,
          slug: ep.slug,
          filename: ep.filename,
          link_embed: ep.link_embed,
          link_m3u8: ep.link_m3u8,
        }));

        // Create video sources from first episode for preview
        const firstEpisode = firstServer.server_data[0];
        const baseUrl = firstEpisode.link_m3u8 || firstEpisode.link_embed;

        if (baseUrl) {
          videoSources = [
            { quality: "1080p", url: baseUrl },
            { quality: "720p", url: baseUrl },
            { quality: "480p", url: baseUrl },
            { quality: "360p", url: baseUrl },
          ];
        }
      }
    }

    // Get recommended movies (from same category)
    let recommendedMovies: any[] = [];
    try {
      if (movie.genre && movie.genre.length > 0) {
        const categoryResponse = await kkphimService.getMoviesByCategory(
          movie.genre[0].toLowerCase(),
          1,
          8
        );

        if (categoryResponse.status && categoryResponse.items) {
          recommendedMovies = categoryResponse.items
            .filter((item: any) => item.slug !== slug) // Exclude current movie
            .slice(0, 6)
            .map((item: any) => kkphimService.convertToAppFormat(item));
        }
      }
    } catch (error) {
      console.warn("Failed to fetch recommended movies:", error);
      // Continue without recommended movies
    }

    return NextResponse.json({
      success: true,
      data: {
        ...movie,
        videoSources,
        episodes: episodes.length > 1 ? episodes : undefined,
        recommendedMovies:
          recommendedMovies.length > 0 ? recommendedMovies : undefined,
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
