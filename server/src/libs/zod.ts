import { z } from "zod";

export const userRegisterDTOSchema = z.object({
    fName: z.string(),
    lName: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
});

export const userLoginDTOSchema = z.object({
    email: z.string().email(),
    password: z.string()
});