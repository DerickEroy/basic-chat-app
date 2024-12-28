import { z, ZodSchema } from "zod";
import type { UserLoginRequest, UserRegisterRequest } from "../types/requests";

export const userRegisterRequestSchema: ZodSchema<UserRegisterRequest> =
  z.object({
    fName: z.string().nonempty("First name is required."),
    lName: z.string().nonempty("Last name is required."),
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(8, "Password too short.")
      .nonempty("Password is required."),
  });

export const userLoginRequestSchema: ZodSchema<UserLoginRequest> = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().nonempty("Password is required."),
});

export const appErrorSchema = z.object({
  name: z.string(),
  message: z.string(),
  statusCode: z.number(),
  isOperational: z.boolean(),
  cause: z
    .array(
      z.object({
        path: z.array(z.union([z.string(), z.number()])),
        value: z.unknown().optional(),
        message: z.string().optional(),
      })
    )
    .optional(),
  originalError: z.instanceof(Error).optional(),
});
