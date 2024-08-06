import { z } from "zod";

// Form schema
export const FormSchema = z.object({
  age: z.coerce
    .number({
      message: "This field is required",
    })
    .min(18, "Age must be at least 18"),
  experience: z.string({
    message: "This field is required",
  }),
  weight: z.coerce
    .number({
      message: "This field is required",
    })
    .min(0, "Weight must be positive"),
  gender: z.string(),
  trainingDays: z.coerce
    .number({
      message: "This field is required",
    })
    .min(1, "Training days must be positive")
    .max(7, "Training frequency must be less than 8"),
  currSquat: z.coerce
    .number({
      message: "This field is required",
    })
    .min(0, "Current squat must be positive"),
  prSquat: z.coerce
    .number({
      message: "This field is required",
    })
    .min(0, "PR squat must be positive"),
  currBench: z.coerce
    .number({
      message: "This field is required",
    })
    .min(0, "Current bench must be positive"),
  prBench: z.coerce
    .number({
      message: "This field is required",
    })
    .min(0, "PR bench must be positive"),
  currDeadlift: z.coerce
    .number({
      message: "This field is required",
    })
    .min(0, "Current deadlift must be positive"),
  prDeadlift: z.coerce
    .number({
      message: "This field is required",
    })
    .min(0, "PR deadlift must be positive"),
});
