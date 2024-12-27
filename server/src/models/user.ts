import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "@src/common/config";
import type { User } from "@src/types/entities";

export const userSchema = new mongoose.Schema<
  User,
  mongoose.Model<User>,
  {
    hashPassword(salt?: number): string;
    createToken(): string;
  }
>({
  fName: {
    type: String,
    cast: "must be a string",
    required: [true, "required"],
  },
  lName: {
    type: String,
    cast: "must be a string",
    required: [true, "required"],
  },
  email: {
    type: String,
    cast: "must be a string",
    required: [true, "required"],
    unique: true,
  },
  auth: {
    type: {
      role: {
        type: String,
        enum: ["user", "admin"],
        cast: "must be a string",
        default: "user",
      },
      password: {
        type: String,
        cast: "must be a string",
        required: [true, "required"],
        minLength: [8, "too short"],
        select: false,
      },
    },
    _id: false,
    required: [true, "required"],
  },
});

userSchema.method("hashPassword", function (salt = 10) {
  const hashedPassword = bcrypt.hashSync(this.auth.password, salt);

  this.auth.password = hashedPassword;

  return hashedPassword;
});

userSchema.method("createToken", function () {
  const token = jwt.sign({ role: this.auth.role }, SECRET_KEY, {
    expiresIn: "24h",
    subject: this.id,
  });

  return token;
});

export const UserModel = mongoose.model("User", userSchema);
