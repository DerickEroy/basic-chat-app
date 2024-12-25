import { z } from "zod";

// Client

export const registerFormSchema = z
  .object({
    fName: z.string().nonempty("First name is required."),
    lName: z.string().nonempty("Last name is required."),
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .nonempty("Password is required."),
    confirmPassword: z.string().nonempty("Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// Server

export const appErrorSchema = z.object({
  name: z.string(),
  statusCode: z.number(),
  isOperational: z.boolean(),
  originalError: z.instanceof(Error).optional(),
  cause: z.array(
    z.object({
      path: z.array(z.union([z.string(), z.number()])),
      value: z.unknown().optional(),
      message: z.string().optional(),
    })
  ),
});
