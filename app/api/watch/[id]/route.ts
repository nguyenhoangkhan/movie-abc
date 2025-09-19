import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shouldResetDailyViews, canAccessResolution } from "@/lib/utils";
import { kkphimService } from "@/lib/kkphim";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: movieSlug } = await params;
    const { resolution = "720p", episode } = await request.json();

    // Get movie from KKPhim API using slug
    const movieDetail = await kkphimService.getMovieDetail(movieSlug);

    if (!movieDetail.status) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    const movie = kkphimService.convertToAppFormat(movieDetail.movie);

    let userId = session?.user?.id;
    let userPlan = session?.user?.plan || "GUEST";

    // Optional: Record watch history if user is logged in
    if (userId) {
      try {
        await prisma.watchHistory.create({
          data: {
            userId,
            movieId: movie.id, // Using KKPhim movie ID
          },
        });
      } catch (error) {
        // Ignore watch history errors, don't block video playback
        console.warn("Failed to record watch history:", error);
      }
    }

    // Get video URL from episodes
    let videoUrl = "";
    let availableResolutions: Record<string, string> = {};
    let episodes: any[] = [];
    let currentEpisode: any = null;

    if (movieDetail.movie.episodes && movieDetail.movie.episodes.length > 0) {
      // Get the first server's episodes
      const firstServer = movieDetail.movie.episodes[0];
      if (firstServer.server_data && firstServer.server_data.length > 0) {
        // Build episodes list
        episodes = firstServer.server_data.map((ep: any) => ({
          name: ep.name,
          slug: ep.slug,
          filename: ep.filename,
          link_embed: ep.link_embed,
          link_m3u8: ep.link_m3u8,
        }));

        // Find the episode to play
        let episodeToPlay = firstServer.server_data[0]; // Default to first episode

        if (episode) {
          const foundEpisode = firstServer.server_data.find(
            (ep: any) => ep.slug === episode
          );
          if (foundEpisode) {
            episodeToPlay = foundEpisode;
          }
        }

        currentEpisode = {
          name: episodeToPlay.name,
          slug: episodeToPlay.slug,
        };

        // Use m3u8 link if available, otherwise use embed link
        videoUrl = episodeToPlay.link_m3u8 || episodeToPlay.link_embed;

        // For simplicity, we'll use the same URL for all resolutions
        // In a real app, you might want to extract different quality streams from the m3u8
        availableResolutions = {
          "1080p": videoUrl,
          "720p": videoUrl,
          "480p": videoUrl,
          "360p": videoUrl,
        };
      }
    }

    if (!videoUrl) {
      return NextResponse.json(
        { success: false, error: "Video URL not available" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        videoUrl: availableResolutions[resolution] || videoUrl,
        resolution,
        movie: {
          id: movie.id,
          title: movie.title,
          description: movie.description,
          thumbnail: movie.thumbnail,
          poster: movie.poster,
          genre: movie.genre.join(", "),
          rating: movie.rating,
          releaseYear: movie.year,
          duration: movie.duration,
          status: movie.status,
          type: movie.type,
          quality: movie.quality,
          view: movie.view,
          episodeCurrent: movie.episodeCurrent,
          episodeTotal: movie.episodeTotal,
        },
        episodes: episodes.length > 1 ? episodes : [], // Only return episodes if there are multiple
        currentEpisode,
      },
    });
  } catch (error) {
    console.error("Watch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
