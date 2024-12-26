import bcrypt from "bcryptjs";
import { UserModel } from "@models/user";
import { AppError } from "@src/common/errors";
import type { RegisterUserDTO, LoginUserDTO } from "@src/types";
import type { JwtPayload } from "jsonwebtoken";

export async function authCheckUseCase(
  decodedToken: string | JwtPayload | undefined,
  token: string | undefined,
  model: typeof UserModel
): Promise<void> {
  const user = await model.findOne({ _id: (decodedToken as JwtPayload).sub });

  if (!user || token !== user.auth.sessionToken) {
    throw new AppError({
      message: "Failed to authorize",
      statusCode: 401,
      isOperational: true,
    });
  }
}

export async function registerUseCase(
  body: RegisterUserDTO,
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

  const token = user.createSessionToken();

  await user.save();

  return token;
}

export async function loginUseCase(
  body: LoginUserDTO,
  model: typeof UserModel
): Promise<string> {
  const user = await model.findOne({ email: body.email });

  if (!user) {
    throw new AppError({
      message: "Document could not be found",
      statusCode: 404,
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
      message: "Failed to authorize",
      statusCode: 403,
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

  const token = user.createSessionToken();

  await user.save();

  return token;
}
