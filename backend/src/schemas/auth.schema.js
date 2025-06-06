import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string({
    required_error: "fullname is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({
      message: "Invalid email address",
    }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    }),
  rrss_1: z
    .string({
      required_error: "Social network link is required",
    })
    .url({
      message: "Invalid URL format",
    })
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email addres is not valid" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const profileSchema = z.object({
  fullname: z
    .string({
      required_error: "fullname is required",
    })
    .min(3, {
      message: "fullname must be at least 3 characters long",
    }),

  email: z
    .string({required_error: "Email is required",})
    .email({
      message: "Invalid email address",
    }),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters long",
    })
    .optional(), // Optional field, only used if the user wants to update the password

  cuenta_bancaria: z
    .string({ required_error: "Bank account is required" })
    .min(15, { message: "Bank account too short" })
    .max(34, { message: "Bank account too long" })
    .regex(/^([A-Z]{2}\d{2}[A-Z0-9]{11,30})$/, { message: "IBAN not valid" }),
  identidad: z
    .string({ required_error: "Bank name is required" })
    .min(4, { message: "Bank name too short" })
    .max(100, { message: "Bank name too long" }),
  dni: z
    .string({ required_error: "DNI is required" })
    .regex(/^\d{8}[A-Z]$/, { message: "DNI not valid" }),
});
