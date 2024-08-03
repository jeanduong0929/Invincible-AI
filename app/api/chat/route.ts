import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(error);
  }
};
