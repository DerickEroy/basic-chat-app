import type mongoose from "mongoose";
import type { userSchema } from "@models/user";

export type Cause = {
    path: string[],
    value: any,
    message?: string
}[];

export type User = mongoose.InferSchemaType<typeof userSchema> & { _id?: mongoose.Types.ObjectId };

export type UserDTO = Pick<User, 'fName' | 'lName' | 'email'> & Pick<User['auth'], 'password'>;