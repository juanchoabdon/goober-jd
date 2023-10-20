import { z } from "zod";

export const RideRequestInputSchema = z.object({
  riderId: z.number(),
  startLocation: z.string(),
  endLocation: z.string(),
  status: z.string().optional(),
});

export type RideRequestInput = z.infer<typeof RideRequestInputSchema>;

export const RideRequestSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  rider_id: z.number(),
  driver_id: z.number().nullable(),
  start_location: z.string().nullable(),
  end_location: z.string().nullable(),
  status: z.string().nullable(),
  finished_at: z.string().nullable(),
  quote_price: z.number().nullable(),
  final_price: z.number().nullable(),
  driver_profit: z.number().nullable(),
  rider_name: z.string().optional(),
});

export type RideQuote = {
  estimatedPrice: string;
  estimatedETA: string;
};

export type PricingSettings = {
    take_rate: number;
    price_km: number;
    base_price: number;
    price_minute: number;
}
  
export type RideRequest = z.infer<typeof RideRequestSchema>;

export const CancelRideInputSchema = z.object({
    rideId: z.number(),
  });
  
export type CancelRideInput = z.infer<typeof CancelRideInputSchema>;