import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const genre = searchParams.get("genre");
    const search = searchParams.get("search");
    const isAdult = searchParams.get("adult") === "true";

    const session = await getServerSession(authOptions);

    // Adult content requires authentication
    if (isAdult && !session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required for adult content" },
        { status: 401 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (genre) {
      where.genre = {
        has: genre,
      };
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (isAdult !== undefined) {
      where.isAdult = isAdult;
    }

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          description: true,
          thumbnail: true,
          duration: true,
          releaseYear: true,
          rating: true,
          genre: true,
          isAdult: true,
          videoUrls: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.movie.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        movies,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("Movies fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
