import express from "express";
import {
  authCheckUseCase,
  loginUseCase,
  registerUseCase,
} from "@src/useCases/user";
import { UserModel } from "@src/models/user";

function _setCookie(token: string, res: express.Response) {
  res.cookie("jwt", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
}

// GET /users/auth-check
export async function authCheckController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await authCheckUseCase(req.decodedToken, req.cookies.jwt, UserModel);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// POST /users/register
export async function registerController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const result = await registerUseCase(req.body, UserModel);

    _setCookie(result, res);

    res.status(201).send({ redirectUrl: "/" });
  } catch (error) {
    next(error);
  }
}

// POST /users/login
export async function loginController(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const result = await loginUseCase(req.body, UserModel);

    _setCookie(result, res);

    res.status(200).send({ redirectUrl: "/" });
  } catch (error) {
    next(error);
  }
}
