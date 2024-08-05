import { RetrieverChainSingleton } from "@/lib/retrieval-chain";
import { NextRequest, NextResponse } from "next/server";

type Input = {
  experience_level: string;
  age: string;
  weight: string;
  gender: string;
  squat_1rm: string;
  bench_1rm: string;
  deadlift_1rm: string;
  training_days: string;
  goal_squat_1rm: string;
  goal_bench_1rm: string;
  goal_deadlift_1rm: string;
};

const DEFAULT_INPUT: Input = {
  experience_level: "advanced",
  age: "29",
  weight: "175 lb",
  gender: "male",
  squat_1rm: "405 lb",
  bench_1rm: "315 lb",
  deadlift_1rm: "455 lb",
  training_days: "6",
  goal_squat_1rm: "455 lb",
  goal_bench_1rm: "365 lb",
  goal_deadlift_1rm: "500 lb",
};

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const input: Input = { ...DEFAULT_INPUT };

    const chain =
      await RetrieverChainSingleton.getInstance().getRetrieverChain();
    const { answer } = await chain.invoke({
      input: "",
      ...input,
    });

    return NextResponse.json({ result: answer }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
