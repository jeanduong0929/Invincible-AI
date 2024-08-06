import { PrismaClientSingleton } from "@/lib/prisma-client-singleton";
import { getAuth } from "@clerk/nextjs/server";
import { Experience } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({
        error: "Unauthorized",
        status: 401,
      });
    }

    // Get the Prisma client
    const prisma = PrismaClientSingleton.getInstance().getPrisma();

    // Get all the experience levels
    const experiences: Experience[] = await prisma.experience.findMany();

    return NextResponse.json({
      experiences,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
};
