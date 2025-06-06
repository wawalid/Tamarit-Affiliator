import { z } from "zod";

export const affiliateLinkSchema = z.object({
  enlace_original: z
    .string({ required_error: "The Tamarit link is required" })
    .url({ message: "It must be a valid URL." })
    .refine((val) =>
      val.startsWith("https://tamaritmotorcycles.com/"),
      {
        message: "The link must come from tamaritmotorcycles.com",
      }
    ),
});
