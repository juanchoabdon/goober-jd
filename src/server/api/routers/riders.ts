import { type Rider, RiderSchema, RiderSignUpInputSchema } from "~/shared/types/riders";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const ridersRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(RiderSignUpInputSchema)
    .mutation(async ({ input, ctx }): Promise<Rider> => {
      const { data: riderData, error } = await ctx.supabase
        .from("riders")
        .insert([{ name: input.name, email: input.email }])
        .select();

      if (error) {
        throw new Error(error.message);
      }
      const validatedRider = RiderSchema.parse(riderData[0]);
      return validatedRider;
    }),
});
