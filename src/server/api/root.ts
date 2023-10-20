import { ridersRouter } from "./routers/riders";
import { createTRPCRouter } from "~/server/api/trpc";
import { ridesRouter } from "./routers/rides";
import { driversRouter } from "./routers/drivers";
import { adminRouter } from "./routers/admin";

export const appRouter = createTRPCRouter({
  riders: ridersRouter,
  rides: ridesRouter,
  drivers: driversRouter,
  admin: adminRouter
});

export type AppRouter = typeof appRouter;
