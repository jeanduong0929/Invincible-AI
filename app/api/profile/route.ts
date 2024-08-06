import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClientSingleton } from "@/lib/prisma-client-singleton";

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = PrismaClientSingleton.getInstance().getPrisma();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      console.error("Profile not found");
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const [experience, gender] = await Promise.all([
      prisma.experience.findFirst({ where: { id: profile.experienceId } }),
      prisma.gender.findFirst({ where: { id: profile.genderId } }),
    ]);

    profile.experience = experience;
    profile.gender = gender;

    return NextResponse.json({ profile, status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("Request body:", body);

    const prisma = PrismaClientSingleton.getInstance().getPrisma();

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.error("User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const [experience, gender] = await Promise.all([
      prisma.experience.findFirst({ where: { name: body.experience } }),
      prisma.gender.findFirst({ where: { name: body.gender } }),
    ]);

    if (!experience) {
      return NextResponse.json(
        { error: "Experience not found" },
        { status: 404 },
      );
    }

    if (!gender) {
      return NextResponse.json({ error: "Gender not found" }, { status: 404 });
    }

    const profileData = {
      userId: user.id,
      age: body.age,
      weight: body.weight,
      trainingDays: body.trainingDays,
      currSquat: body.currSquat,
      currBench: body.currBench,
      currDeadlift: body.currDeadlift,
      prSquat: body.prSquat,
      prBench: body.prBench,
      prDeadlift: body.prDeadlift,
      experienceId: experience.id,
      genderId: gender.id,
    };

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: profileData,
      create: profileData,
    });

    console.log("Profile updated");
    return NextResponse.json({ message: "Profile updated" }, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
