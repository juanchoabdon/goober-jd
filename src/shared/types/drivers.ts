import { z } from "zod";

export type Driver = {
  id: number;
  created_at: string;
  name: string | null;
  email: string | null;
  current_location: string | null;
  status: string | null;
  plate: string | null;
  car_model: string | null;
};


export interface DriverFormData {
    name: string;
    plate: string;
    carModel: string;
    email: string;
}

export type DriverInput = {
  name: string | null;
  email: string | null;
  current_location: string | null;
  status: string | null;
  plate: string | null;
  car_model: string | null;
};

export const DriverSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  current_location: z.string().nullable(),
  status: z.string().nullable(),
  plate: z.string().nullable(),
  car_model: z.string().nullable(),
});

export const DriverInputSchema = z.object({
  name: z.string().nullable(),
  email: z.string().nullable(),
  current_location: z.string().nullable(),
  status: z.string().nullable(),
  plate: z.string().nullable(),
  car_model: z.string().nullable(),
});

export const UpdateDriverLocationInputSchema = z.object({
  driverId: z.number(),
  currentLocation: z.string(),
});

export const UpdateDriverStatusInputSchema = z.object({
  driverId: z.number(),
  status: z.string(),
});
