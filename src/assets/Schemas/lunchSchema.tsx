import { z } from "zod";

export const lunchSchema = z.object({
  mesa: z.string().min(1, "La mesa es obligatoria"),
  Pedidos: z
    .array(
      z.object({
        nombre: z.string(),
        precio: z.number(),
      })
    )
    .min(1, "Debes seleccionar al menos un almuerzo"),
});

export type LunchFormData = z.infer<typeof lunchSchema>;
