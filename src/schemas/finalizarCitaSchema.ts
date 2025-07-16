import { z } from "zod";
import { reciboItemSchema } from "./reciboSchema";

export const finalizarCitaSchema = z
  .object({
    citaId: z.number(),
    clienteId: z.number(),
    generarFactura: z.boolean(),
    items: z.array(reciboItemSchema).min(1, "Debes agregar al menos un ítem"),
    matricula: z.string().optional(),
    tipoLamina: z.string().optional(),
    servicios: z
      .array(
        z.object({
          nombre: z.string(),
          precio: z.number(),
        })
      )
      .optional(),
  })
  .refine(
    (data) => {
      const hayTintado = data.items.some(
        (item) => item.descripcion === "Tintado de Lunas"
      );
      if (hayTintado) {
        return !!data.tipoLamina && data.tipoLamina.trim() !== "";
      }
      return true;
    },
    {
      message: "El tipo de lámina es obligatorio si hay Tintado de Lunas.",
      path: ["tipoLamina"],
    }
  );

export type FinalizarCitaInput = z.infer<typeof finalizarCitaSchema>;
