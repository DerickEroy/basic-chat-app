import { z, ZodSchema } from "zod";
import { LoginForm, RegisterFormWithConfirmPassword } from "../common/types";

export const registerFormSchema: ZodSchema<RegisterFormWithConfirmPassword> = z
  .object({
    fName: z.string().nonempty("First name is required."),
    lName: z.string().nonempty("Last name is required."),
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(8, "Password too short.")
      .nonempty("Password is required."),
    confirmPassword: z.string().nonempty("Confirm password is required."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginFormSchema: ZodSchema<LoginForm> = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().nonempty("Password is required."),
});
