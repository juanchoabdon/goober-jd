import { z } from "zod";
import {
  type RideRequest,
  RideRequestInputSchema,
  RideRequestSchema,
  type RideQuote,
  CancelRideInputSchema,
} from "~/shared/types/rides";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  calculateRidePrice,
  calculateRideETA,
  calculateFinalRidePrice,
  calculateDistance,
} from "~/utils/utils";
import { type PricingSettings } from "~/shared/types/rides";
import { type PositionAbrev } from "~/shared/types/map";

export const ridesRouter = createTRPCRouter({
  requestRide: publicProcedure
    .input(RideRequestInputSchema)
    .mutation(async ({ input, ctx }): Promise<RideRequest> => {
      const response = await ctx.supabase.from("settings").select("*").single();

      const priceSettings: PricingSettings = response.data as PricingSettings;

      const quotePrice: number = calculateRidePrice(
        JSON.parse(input.startLocation) as PositionAbrev,
        JSON.parse(input.endLocation) as PositionAbrev,
        priceSettings,
      );

      const newRide = {
        rider_id: input.riderId,
        start_location: input.startLocation,
        end_location: input.endLocation,
        status: "requested",
        quote_price: quotePrice.toFixed(2),
      };

      const { data: rideRequestData, error } = await ctx.supabase
        .from("rides")
        .insert(newRide)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      const validatedRideRequest = RideRequestSchema.parse(rideRequestData[0]);
      return validatedRideRequest;
    }),

  getRideQuote: publicProcedure
    .input(RideRequestInputSchema)
    .mutation(async ({ input, ctx }): Promise<RideQuote> => {
      const response = await ctx.supabase.from("settings").select("*").single();

      const priceSettings: PricingSettings = response.data as PricingSettings;
      const quotePrice = calculateRidePrice(
        JSON.parse(input.startLocation) as PositionAbrev,
        JSON.parse(input.endLocation) as PositionAbrev,
        priceSettings,
      );
      const estimatedETA = calculateRideETA(
        JSON.parse(input.startLocation) as PositionAbrev,
        JSON.parse(input.endLocation) as PositionAbrev,
      );
      return {
        estimatedPrice: `$${quotePrice.toFixed(2)}`,
        estimatedETA: `${estimatedETA.toFixed(0)} minutes`,
      };
    }),

  cancelRide: publicProcedure
    .input(CancelRideInputSchema)
    .mutation(async ({ input, ctx }): Promise<RideRequest> => {
      const updatedRideInfo = {
        id: input.rideId,
        status: "cancelled",
        finished_at: new Date().toISOString(),
      };
      const { data: updatedRideData, error } = await ctx.supabase
        .from("rides")
        .upsert(updatedRideInfo)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!updatedRideData) {
        throw new Error("Failed to cancel the ride. Ride not found.");
      }
      const validatedRide = RideRequestSchema.parse(updatedRideData[0]);

      return validatedRide;
    }),

  acceptRide: publicProcedure
    .input(
      z.object({
        rideId: z.number(),
        driverId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<RideRequest> => {
      const { rideId, driverId } = input;

      const { data: rideData, error: fetchRideError } = await ctx.supabase
        .from("rides")
        .select("rider_id")
        .eq("id", rideId)
        .single();

      if (fetchRideError) {
        throw new Error(fetchRideError.message);
      }

      if (!rideData) {
        throw new Error("Ride not found.");
      }

      const riderId = rideData.rider_id as number;

      const { data: riderData, error: fetchRiderError } = await ctx.supabase
        .from("riders")
        .select("name")
        .eq("id", riderId)
        .single();

      if (fetchRiderError) {
        throw new Error(fetchRiderError.message);
      }

      if (!riderData) {
        throw new Error("Rider not found.");
      }

      const riderName = riderData.name as string;

      const { data: updatedRideData, error: upsertError } = await ctx.supabase
        .from("rides")
        .upsert({
          id: rideId,
          driver_id: driverId,
          status: "inRoute",
        })
        .select();

      if (upsertError) {
        throw new Error(upsertError.message);
      }
      if (!updatedRideData || updatedRideData.length === 0) {
        throw new Error("Failed to accept the ride.");
      }

      return RideRequestSchema.parse({
        ...updatedRideData[0],
        rider_name: riderName,
      });
    }),
  changeRideStatus: publicProcedure
    .input(
      z.object({
        rideId: z.number(),
        status: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<RideRequest> => {
      const { rideId, status } = input;
      const now = new Date();
      const updateObject = {
        id: rideId,
        status,
        final_price: null,
        finished_at: now,
        driver_profit: 0,
      };

      if (status === "finished") {
        const { data: rideDetails, error: fetchError } = await ctx.supabase
          .from("rides")
          .select("created_at, start_location, end_location")
          .eq("id", rideId)
          .single();

        if (fetchError ?? !rideDetails) {
          throw new Error("Failed to fetch ride details.");
        }

        const timeDifference =
          (now.getTime() -
            new Date(rideDetails.created_at as string).getTime()) /
          60000;
        const response = await ctx.supabase
          .from("settings")
          .select("*")
          .single();

        const priceSettings: PricingSettings = response.data as PricingSettings;

        const finalPrice: number = calculateFinalRidePrice(
          JSON.parse(rideDetails.start_location as string) as PositionAbrev,
          JSON.parse(rideDetails.end_location as string) as PositionAbrev,
          priceSettings,
          timeDifference,
        );

        updateObject.final_price = finalPrice.toFixed(2);
        updateObject.finished_at = now;
        updateObject.driver_profit = (
          (finalPrice * priceSettings.take_rate) /
          100
        ).toFixed(2);
      }

      const { data: updatedRideData, error } = await ctx.supabase
        .from("rides")
        .upsert(updateObject)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!updatedRideData || updatedRideData.length === 0) {
        throw new Error("Failed to update ride status. Ride not found.");
      }

      return RideRequestSchema.parse(updatedRideData[0]);
    }),

  getFinishedRidesByDriver: publicProcedure
    .input(z.number())
    .mutation(async ({ input: driverId, ctx }): Promise<RideRequest[]> => {
      const { data: ridesData, error } = await ctx.supabase
        .from("rides")
        .select("*")
        .eq("driver_id", driverId)
        .eq("status", "finished");

      if (error) {
        throw new Error(error.message);
      }

      if (!ridesData || ridesData.length === 0) {
        return [];
      }

      return ridesData.map((ride) => RideRequestSchema.parse(ride));
    }),

  getTotalDriverProfit: publicProcedure
    .input(z.number())
    .mutation(
      async ({ input: driverId, ctx }): Promise<{ totalProfit: string }> => {
        const { data: ridesData, error } = await ctx.supabase
          .from("rides")
          .select("driver_profit")
          .eq("driver_id", driverId)
          .eq("status", "finished");

        if (error) {
          throw new Error(error.message);
        }

        const totalProfit = ridesData.reduce(
          (acc, ride) => acc + parseFloat(ride.driver_profit || 0),
          0,
        );

        return {
          totalProfit: totalProfit.toFixed(2),
        };
      },
    ),

  assignDriversToRides: publicProcedure.mutation(
    async ({ ctx }): Promise<void> => {
      const { data: requestedRides, error: rideError } = await ctx.supabase
        .from("rides")
        .select()
        .eq("status", "requested");

      if (rideError) {
        throw new Error(rideError.message);
      }

      let { data: availableDrivers, error: driverError } = await ctx.supabase
        .from("drivers")
        .select()
        .eq("status", "available");

      if (driverError) {
        throw new Error(driverError.message);
      }

      for (const ride of requestedRides) {
        let closestDriver = null;
        let minimumDistance = Infinity;

        for (const driver of availableDrivers) {
          const distance = calculateDistance(
            ride.start_location,
            driver.current_location,
          );
          if (distance < 2 && distance < minimumDistance) {
            closestDriver = driver;
            minimumDistance = distance;
          }
        }

        if (closestDriver && minimumDistance <= 2) {
          // Assign the driver to this ride and update both the ride and driver status.
          const { error: updateRideError } = await ctx.supabase
            .from("rides")
            .upsert({ id: ride.id, driver_id: closestDriver.id })
            .eq("id", ride.id);

          if (updateRideError) {
            throw new Error(updateRideError.message);
          }

          if (updateDriverError) {
            throw new Error(updateDriverError.message);
          }

          // Remove the assigned driver from availableDrivers so they're not considered for the next loop
          availableDrivers = availableDrivers.filter(
            (driver) => driver.id !== closestDriver.id,
          );
        }
      }
    },
  ),
});
