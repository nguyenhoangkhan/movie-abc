import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { kkphimService } from "@/lib/kkphim";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id: movieSlug } = await params;
    const { resolution = "720p", episode } = await request.json();

    // Get movie from PhimAPI using slug
    const movieDetail = await kkphimService.getMovieDetail(movieSlug);

    if (!movieDetail.status) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }
    console.log("movieDetail ", movieDetail);

    const movie = kkphimService.convertToAppFormat(movieDetail.movie);

    let userId = session?.user?.id;

    // Optional: Record watch history if user is logged in
    if (userId) {
      try {
        await prisma.watchHistory.create({
          data: {
            userId,
            movieId: movie.id, // Using PhimAPI movie ID
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
            (ep: any) => ep.slug === episode || ep.name === episode
          );
          if (foundEpisode) {
            episodeToPlay = foundEpisode;
          }
        }

        currentEpisode = {
          name: episodeToPlay.name,
          slug: episodeToPlay.slug,
          filename: episodeToPlay.filename,
        };

        // Priority: m3u8 > embed link
        // M3U8 links are preferred for better quality and compatibility
        if (episodeToPlay.link_m3u8) {
          videoUrl = episodeToPlay.link_m3u8;
          console.log("Using M3U8 link:", videoUrl);
        } else if (episodeToPlay.link_embed) {
          videoUrl = episodeToPlay.link_embed;
          console.log("Using embed link:", videoUrl);
        }

        // For M3U8 streams, we'll provide multiple quality options
        // In reality, you might want to parse the M3U8 file to get actual quality variants
        availableResolutions = {
          "1080p": videoUrl,
          "720p": videoUrl,
          "480p": videoUrl,
          "360p": videoUrl,
        };

        console.log("Episode data:", {
          total: episodes.length,
          current: currentEpisode,
          hasM3U8: !!episodeToPlay.link_m3u8,
          hasEmbed: !!episodeToPlay.link_embed,
        });
      }
    }

    // If no video URL is found, we'll still return movie info
    // This allows the frontend to handle the no-video case gracefully
    if (!videoUrl) {
      console.log(
        "No video URL found for:",
        movieSlug,
        "but returning movie info"
      );

      return NextResponse.json({
        success: true,
        data: {
          videoUrl: null,
          resolution: null,
          availableResolutions: [],
          videoType: null,
          hasVideo: false,
          message: "Video not available for this movie",
          movie: {
            tmdb: movie.tmdb,
            id: movie.id,
            title: movie.title,
            originalTitle: movie.originalTitle,
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
            slug: movie.slug,
          },
          episodes: episodes.length > 1 ? episodes : [],
          currentEpisode,
          serverInfo: {
            name: movieDetail.movie.episodes?.[0]?.server_name || "Default",
            totalServers: movieDetail.movie.episodes?.length || 1,
          },
        },
      });
    }

    console.log("Returning video data:", {
      resolution,
      videoUrl: videoUrl.substring(0, 100) + "...",
      episodeCount: episodes.length,
      currentEpisode: currentEpisode?.name,
    });

    return NextResponse.json({
      success: true,
      data: {
        videoUrl: availableResolutions[resolution] || videoUrl,
        resolution,
        availableResolutions: Object.keys(availableResolutions),
        videoType: videoUrl.includes(".m3u8") ? "hls" : "mp4",
        hasVideo: true,
        movie: {
          id: movie.id,
          title: movie.title,
          originalTitle: movie.originalTitle,
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
          slug: movie.slug,
        },
        episodes: episodes.length > 1 ? episodes : [], // Only return episodes if there are multiple
        currentEpisode,
        serverInfo: {
          name: movieDetail.movie.episodes?.[0]?.server_name || "Default",
          totalServers: movieDetail.movie.episodes?.length || 1,
        },
      },
    });
  } catch (error) {
    console.error("Watch API error:", error);

    // More detailed error response
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    const isNetworkError =
      errorMessage.includes("fetch") || errorMessage.includes("network");

    return NextResponse.json(
      {
        success: false,
        error: isNetworkError
          ? "Failed to connect to video service"
          : "Internal server error",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: isNetworkError ? 503 : 500 }
    );
  }
}
