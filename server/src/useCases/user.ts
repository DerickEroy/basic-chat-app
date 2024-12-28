import bcrypt from "bcryptjs";
import { UserModel } from "@models/user";
import { AppError } from "@src/common/errors";
import type {
  UserLoginRequest,
  UserRegisterRequest,
} from "@src/types/requests";

export async function registerUseCase(
  body: UserRegisterRequest,
  model: typeof UserModel
): Promise<string> {
  const existingUser = await model.findOne({ email: body.email });

  if (existingUser) {
    throw new AppError({
      message: "Document already exists",
      statusCode: 409,
      isOperational: true,
      cause: [
        {
          path: ["email"],
          value: body.email,
          message: "Email already in use",
        },
      ],
    });
  }

  const user = new model({
    ...body,
    auth: { password: body.password },
  });

  await user.validate();

  user.hashPassword();

  const token = user.createToken();

  await user.save();

  return token;
}

export async function loginUseCase(
  body: UserLoginRequest,
  model: typeof UserModel
): Promise<string> {
  const user = await model.findOne({ email: body.email }, "+auth.password");

  if (!user) {
    throw new AppError({
      message: "Validation failed",
      statusCode: 400,
      isOperational: true,
      cause: [
        {
          path: ["email"],
          value: body.email,
          message: "Email does not exist",
        },
      ],
    });
  }

  const isPasswordCorrect = bcrypt.compareSync(
    body.password,
    user.auth.password
  );

  if (!isPasswordCorrect) {
    throw new AppError({
      message: "Unauthorized",
      statusCode: 401,
      isOperational: true,
      cause: [
        {
          path: ["password"],
          value: body.password,
          message: "Password is incorrect",
        },
      ],
    });
  }

  const token = user.createToken();

  await user.save();

  return token;
}
