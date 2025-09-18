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
    const { resolution = "720p" } = await request.json();

    // Get movie from KKPhim API using slug
    const movieDetail = await kkphimService.getMovieDetail(movieSlug);

    if (!movieDetail.status) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    const movie = kkphimService.convertToAppFormat(movieDetail.movie);

    // Check if adult content requires authentication
    if (movie.isAdult && !session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required for adult content" },
        { status: 401 }
      );
    }

    let userId = session?.user?.id;
    let userPlan = session?.user?.plan || "GUEST";
    let canWatch = true;
    let quotaMessage = "";

    // Handle authenticated users
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      // Reset daily views if needed
      let currentDailyViews = user.dailyViews;
      if (shouldResetDailyViews(user.lastViewReset)) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            dailyViews: 0,
            lastViewReset: new Date(),
          },
        });
        currentDailyViews = 0;
      }

      userPlan = user.plan;
      const freeViewsLimit = parseInt(process.env.FREE_DAILY_VIEWS || "5");
      const totalViews = currentDailyViews + user.bonusViews;

      // Check quota for free users
      if (user.plan === "FREE" && totalViews >= freeViewsLimit) {
        canWatch = false;
        quotaMessage =
          "Daily view limit reached. Upgrade to Premium or invite friends for more views.";
      }

      // For simplicity, we'll just use the current plan
      // In a real app, you would check premium expiry here
      userPlan = user.plan;

      // If can watch, record the view
      if (canWatch) {
        // Deduct view from bonus first, then daily
        if (user.bonusViews > 0) {
          await prisma.user.update({
            where: { id: userId },
            data: { bonusViews: user.bonusViews - 1 },
          });
        } else if (user.plan === "FREE") {
          await prisma.user.update({
            where: { id: userId },
            data: { dailyViews: currentDailyViews + 1 },
          });
        }

        // Record watch history if user is logged in
        if (userId) {
          await prisma.watchHistory.create({
            data: {
              userId,
              movieId: movie.id, // Using KKPhim movie ID
            },
          });
        }
      }
    } else {
      // Guest users have limited access
      if (movie.isAdult) {
        canWatch = false;
        quotaMessage = "Please login to access this content.";
      }
    }

    // Check resolution access
    if (!canAccessResolution(userPlan, resolution)) {
      return NextResponse.json(
        {
          success: false,
          error: `${resolution} quality requires Premium subscription`,
        },
        { status: 403 }
      );
    }

    if (!canWatch) {
      return NextResponse.json(
        {
          success: false,
          error: quotaMessage,
          quotaExceeded: true,
        },
        { status: 403 }
      );
    }

    // Get video URL from episodes
    let videoUrl = "";
    let availableResolutions: Record<string, string> = {};

    if (movieDetail.movie.episodes && movieDetail.movie.episodes.length > 0) {
      // Get the first server's first episode
      const firstServer = movieDetail.movie.episodes[0];
      if (firstServer.server_data && firstServer.server_data.length > 0) {
        const firstEpisode = firstServer.server_data[0];

        // Use m3u8 link if available, otherwise use embed link
        videoUrl = firstEpisode.link_m3u8 || firstEpisode.link_embed;

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
          genre: movie.genre.join(", "),
          rating: movie.rating,
          releaseYear: movie.year,
        },
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
