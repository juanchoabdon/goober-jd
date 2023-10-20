import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import {
  type Driver,
  DriverInputSchema,
  DriverSchema,
  UpdateDriverLocationInputSchema,
  UpdateDriverStatusInputSchema,
} from "~/shared/types/drivers";

export const driversRouter = createTRPCRouter({
  createDriver: publicProcedure
    .input(DriverInputSchema)
    .mutation(async ({ input, ctx }): Promise<Driver> => {
      const newDriver = {
        name: input.name,
        email: input.email,
        current_location: input.current_location,
        status: input.status,
        plate: input.plate,
        car_model: input.car_model,
      };

      const { data: driverData, error } = await ctx.supabase
        .from("drivers")
        .insert(newDriver)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      const validatedDriver = DriverSchema.parse(driverData[0]);
      return validatedDriver;
    }),

  getDriverById: publicProcedure
    .input(z.number())
    .mutation(async ({ input: driverId, ctx }): Promise<Driver | null> => {
      const response = await ctx.supabase
        .from("drivers")
        .select("*")
        .eq("id", driverId)
        .single();
      const driverData: Driver = response.data as Driver;
      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!driverData) {
        return null;
      }

      return DriverSchema.parse(driverData);
    }),

  updateDriverLocation: publicProcedure
    .input(UpdateDriverLocationInputSchema)
    .mutation(async ({ input, ctx }): Promise<Driver> => {
      const updatedDriverInfo = {
        id: input.driverId,
        current_location: input.currentLocation,
      };
      const { data: updatedDriverData, error } = await ctx.supabase
        .from("drivers")
        .upsert(updatedDriverInfo)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!updatedDriverData) {
        throw new Error(
          "Failed to update the driver location. Driver not found.",
        );
      }

      return DriverSchema.parse(updatedDriverData[0]);
    }),

  updateDriverStatus: publicProcedure
    .input(UpdateDriverStatusInputSchema)
    .mutation(async ({ input, ctx }): Promise<Driver> => {
      const updatedDriverInfo = {
        id: input.driverId,
        status: input.status,
      };
      const { data: updatedDriverData, error } = await ctx.supabase
        .from("drivers")
        .upsert(updatedDriverInfo)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!updatedDriverData) {
        throw new Error(
          "Failed to update the driver status. Driver not found.",
        );
      }

      return DriverSchema.parse(updatedDriverData[0]);
    }),
});
