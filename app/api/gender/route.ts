import { PrismaClientSingleton } from "@/lib/prisma-client-singleton";
import { Gender } from "@/models/gender";
import { getAuth } from "@clerk/nextjs/server";
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

    // Get Prisma client
    const prisma = PrismaClientSingleton.getInstance().getPrisma();

    // Fetch all genders
    const genders: Gender[] = await prisma.gender.findMany();

    return NextResponse.json({
      genders,
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: 500,
    });
  }
};
