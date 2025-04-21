import { z } from "zod";

export const lunchSchema = z.object({
  nombre: z.string(),
  precio: z.number(),
  cantidad: z.number().optional(),
});

export type Order = z.infer<typeof lunchSchema>;
