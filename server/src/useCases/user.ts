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
    throw AppError.conflict([
      {
        path: ["email"],
        value: body.email,
        message: "Email already in use",
      },
    ]);
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
  const user = await model.findOne({ email: body.email });

  if (!user) {
    throw AppError.notFound([
      {
        path: ["email"],
        value: body.email,
        message: "Email does not exist",
      },
    ]);
  }

  const isPasswordCorrect = bcrypt.compareSync(
    body.password,
    user.auth.password
  );

  if (!isPasswordCorrect) {
    throw AppError.forbidden([
      {
        path: ["password"],
        value: body.password,
        message: "Password is incorrect",
      },
    ]);
  }

  const token = user.createToken();

  await user.save();

  return token;
}
