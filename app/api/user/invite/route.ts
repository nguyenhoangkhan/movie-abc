import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInviteCode } from "@/lib/utils";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = inviteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email address",
        },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const userId = session.user.id;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 400 }
      );
    }

    // Check if invite already exists
    const existingInvite = await prisma.invite.findFirst({
      where: {
        inviterId: userId,
        email,
        status: "PENDING",
      },
    });

    if (existingInvite) {
      return NextResponse.json(
        {
          success: false,
          error: "Invite already sent to this email",
        },
        { status: 400 }
      );
    }

    // Create invite
    const invite = await prisma.invite.create({
      data: {
        inviterId: userId,
        email,
        code: generateInviteCode(),
        status: "PENDING",
      },
    });

    // In a real app, you would send an email here
    // For demo purposes, we'll just return the invite code

    return NextResponse.json({
      success: true,
      message: "Invite sent successfully!",
      data: {
        inviteCode: invite.code,
        email: invite.email,
      },
    });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get user's invites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const invites = await prisma.invite.findMany({
      where: {
        inviterId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        email: true,
        code: true,
        status: true,
        createdAt: true,
        acceptedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: invites,
    });
  } catch (error) {
    console.error("Get invites error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
