import { Experience } from "@prisma/client";
import { Gender } from "./gender";
import { User } from "@clerk/nextjs/server";

export interface Profile {
  id: number;
  age: number;
  weight: number;
  trainingDays: number;
  experience: Experience;
  gender: Gender;
  currSquat: number;
  prSquat: number;
  currBench: number;
  prBench: number;
  currDeadlift: number;
  prDeadlift: number;
  userId: User;
}
