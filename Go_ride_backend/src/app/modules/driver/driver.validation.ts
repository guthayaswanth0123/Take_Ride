import { z } from "zod";

export const createDriverZodSchema = z.object({
  vehicleType: z.string({
    message: "Vehicle type is required",
  }),
  vehicleNumber: z.string({
    message: "Vehicle number is required",
  }),
});