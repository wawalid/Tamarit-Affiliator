import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
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



export const bankingDataSchema = z.object({
  cuenta_bancaria: z.string()
    .min(15, { message: "Cuenta bancaria demasiado corta" })
    .max(34, { message: "Cuenta bancaria demasiado larga" })
    .regex(/^([A-Z]{2}\d{2}[A-Z0-9]{11,30})$/, { message: "IBAN inválido" }),
  
  identidad: z.string()
    .min(5, { message: "Identidad demasiado corta" })
    .max(100, { message: "Identidad demasiado larga" }),
  
  dni: z.string()
    .regex(/^\d{8}[A-Z]$/, { message: "DNI inválido" }),

  completado: z.boolean().optional(), 
});
