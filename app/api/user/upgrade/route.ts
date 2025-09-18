import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const upgradeSchema = z.object({
  plan: z.enum(["PREMIUM"]),
  duration: z.enum(["monthly", "yearly"]).default("monthly"),
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
    const result = upgradeSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: result.error.errors,
        },
        { status: 400 }
      );
    }

    const { plan, duration } = result.data;
    const userId = session.user.id;

    // Mock payment processing (replace with real payment gateway)
    const amount = duration === "monthly" ? 9.99 : 99.99;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        type: "PREMIUM_UPGRADE",
        status: "COMPLETED", // In real app, this would be PENDING until payment confirms
        metadata: JSON.stringify({
          currency: "USD",
          description: `Premium ${duration} subscription`,
          duration,
        }),
      },
    });

    // Update user plan
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        plan: "PREMIUM",
      },
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully upgraded to Premium!",
      data: {
        user: updatedUser,
        payment: {
          id: payment.id,
          amount: payment.amount,
          duration,
        },
      },
    });
  } catch (error) {
    console.error("Upgrade error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
