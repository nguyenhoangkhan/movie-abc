import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const movieId = params.id;

    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      return NextResponse.json(
        { success: false, error: "Movie not found" },
        { status: 404 }
      );
    }

    // Check if adult content requires authentication
    if (movie.isAdult && !session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required for adult content" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    console.error("Movie fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
