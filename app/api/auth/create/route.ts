import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClientSingleton } from "@/lib/prisma-client-singleton";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = PrismaClientSingleton.getInstance().getPrisma();

    const user = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: { clerkId: userId },
    });

    const message = user ? "User updated" : "User created";
    console.log(message);

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("Error in user creation/update:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
