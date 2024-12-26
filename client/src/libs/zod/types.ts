import { z } from "zod";
import { appErrorSchema, registerFormSchema } from "./schemas";

// Client

export type RegisterForm = z.infer<typeof registerFormSchema>;

// Server

export type AppError = z.infer<typeof appErrorSchema>;
