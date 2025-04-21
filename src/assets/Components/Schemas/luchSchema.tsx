import { z } from "zod";

export const lunchSchema = z.object({
  nombre: z.string(),
  precio: z.number(),
});

export type Order = z.infer<typeof lunchSchema>;
