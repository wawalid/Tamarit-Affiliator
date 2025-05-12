import { z } from "zod";

export const affiliateLinkSchema = z.object({
  enlace_original: z
    .string({ required_error: "El enlace original es obligatorio" })
    .url({ message: "Debe ser una URL válida" })
    .refine((val) =>
      val.startsWith("https://tamaritmotorcycles.com/"),
      {
        message: "El enlace debe provenir de tamaritmotorcycles.com",
      }
    ),
});
