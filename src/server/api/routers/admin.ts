import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  type RevenueProfits,
  type RevenueProfitsStats,
  type RidesStats,
  type UpdatedSettings,
  type FormattedRide,
  type RideData,
} from "~/shared/types/admin";
import { type Location } from "~/shared/types/map";

export const adminRouter = createTRPCRouter({
  getRevenueProfitsStats: publicProcedure.mutation(
    async ({ ctx }): Promise<RevenueProfitsStats> => {
      const getStatsForDays = async (days: number): Promise<RevenueProfits> => {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        const isoFromDate = fromDate.toISOString();

        const { data: ridesData, error } = await ctx.supabase
          .from("rides")
          .select("final_price, driver_profit")
          .gte("finished_at", isoFromDate)
          .eq("status", "finished");

        if (error) {
          throw new Error(error.message);
        }

        const revenue = ridesData.reduce(
          (sum, ride) => sum + parseFloat(ride.final_price as string),
          0,
        );
        const driverProfits = ridesData.reduce(
          (sum, ride) => sum + parseFloat(ride.driver_profit as string),
          0,
        );
        const profits = revenue - driverProfits;

        return {
          revenue: revenue.toFixed(2),
          profits: profits.toFixed(2),
        };
      };

      return {
        days30: await getStatsForDays(30),
        days90: await getStatsForDays(90),
        days180: await getStatsForDays(180),
      };
    },
  ),

  getRidesStats: publicProcedure.mutation(
    async ({ ctx }): Promise<RidesStats> => {
      const { data: activeRidesData, error: activeError } = await ctx.supabase
        .from("rides")
        .select("*")
        .neq("status", "finished");

      if (activeError) {
        throw new Error(activeError.message);
      }

      const { data: finishedRidesData, error: finishedError } =
        await ctx.supabase.from("rides").select("*").eq("status", "finished");

      if (finishedError) {
        throw new Error(finishedError.message);
      }

      return {
        activeRides: activeRidesData.length,
        finishedRides: finishedRidesData.length,
      };
    },
  ),

  updateSettings: publicProcedure
    .input(
      z.object({
        take_rate: z.number().optional(),
        price_km: z.number().optional(),
        base_price: z.number().optional(),
        price_minute: z.number().optional(),
      }),
    )
    .mutation(async ({ input, ctx }): Promise<UpdatedSettings> => {
      const { data: updatedSettingsData, error } = await ctx.supabase
        .from("settings")
        .update({
          ...input,
        })
        .eq("id", 1)
        .select();

      if (error) {
        throw new Error(error.message);
      }

      if (!updatedSettingsData || updatedSettingsData.length === 0) {
        throw new Error("Failed to update settings.");
      }

      return updatedSettingsData[0] as UpdatedSettings;
    }),

  getSettings: publicProcedure.mutation(
    async ({ ctx }): Promise<UpdatedSettings[]> => {
      const { data: settingsData, error } = await ctx.supabase
        .from("settings")
        .select("*");

      if (error) {
        throw new Error(error.message);
      }

      if (!settingsData || settingsData.length === 0) {
        throw new Error("Failed to update settings.");
      }

      return settingsData as UpdatedSettings[];
    },
  ),

  getRides: publicProcedure.mutation(
    async ({ ctx }): Promise<FormattedRide[]> => {
      const response = await ctx.supabase
        .from("rides")
        .select(
          `
        id,
        created_at,
        status,
        start_location,
        end_location,
        final_price,
        driver_profit,
        finished_at,
        drivers (id, name),
        riders (id, name)
      `,
        )
        .order("created_at", { ascending: false });

      if (response.error) {
        throw new Error(response.error.message);
      }
      const ridesData: RideData[] = response.data;

      const formattedRidesData: FormattedRide[] = ridesData.map(
        (ride: RideData) => {
          const startLocation: Location = JSON.parse(
            ride.start_location,
          ) as Location;
          const endLocation: Location = JSON.parse(
            ride.end_location,
          ) as Location;

          return {
            rideId: ride.id,
            created_at: ride.created_at,
            driver: {
              id: ride?.drivers?.[0]?.id ?? 0,
              name: ride?.drivers?.[0]?.name ?? "",
            },
            rider: {
              id: ride?.riders?.[0]?.id ?? 0,
              name: ride?.riders?.[0]?.name ?? "",
            },
            status: ride.status,
            pickup_address: startLocation.address,
            dropoff_address: endLocation.address,
            finished_at: ride.finished_at,
            price: parseFloat(ride.final_price) || 0,
            company_profits:
              parseFloat(ride.final_price) - parseFloat(ride.driver_profit) ||
              0,
          };
        },
      );

      return formattedRidesData;
    },
  ),
});
