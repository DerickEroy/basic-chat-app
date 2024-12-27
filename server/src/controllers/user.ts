import express from "express";
import { loginUseCase, registerUseCase } from "@src/useCases/user";
import { UserModel } from "@src/models/user";

export async function registerController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const result = await registerUseCase(req.body, UserModel);

    res.status(201).send({ redirectUrl: "/", jwt: result });
  } catch (error) {
    next(error);
  }
}

export async function loginController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const result = await loginUseCase(req.body, UserModel);

    res.status(200).send({ redirectUrl: "/", jwt: result });
  } catch (error) {
    next(error);
  }
}
