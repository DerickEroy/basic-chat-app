import bcrypt from "bcryptjs";
import { UserModel } from "@models/user";
import { AppError } from "@src/common/errors";
import type { RegisterUserDTO, LoginUserDTO } from "@common/types";

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
      message: "Document could not found",
      statusCode: 404,
      isOperational: true,
      cause: [
        {
          path: ["email"],
          value: body.email,
          message: "Email not found",
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
