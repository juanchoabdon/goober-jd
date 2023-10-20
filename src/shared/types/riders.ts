import { z } from "zod";

export const RiderSignUpInputSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

export type RiderSignUpInput = z.infer<typeof RiderSignUpInputSchema>;

export const RiderSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

// Infer the TypeScript type from the Zod schema
export type Rider = z.infer<typeof RiderSchema>;