import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import type { ZodSchema } from "zod";
import {
  AppError,
  transformMongooseValidationError,
  transformZodError,
} from "@common/errors";
import { SECRET_KEY } from "./config";

export function globalErrorHandler(
  error: any,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  console.dir(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json(error.toObject());
  } else if (error instanceof mongoose.Error.ValidationError) {
    const errorResponse = transformMongooseValidationError(error);
    res.status(400).json(errorResponse);
  } else {
    const errorResponse = AppError.default(error).toObject();
    res.status(errorResponse.statusCode).json(errorResponse);
  }
}

export function validateRequestBody(schema: ZodSchema) {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const validation = schema.safeParse(req.body);

    if (!validation.success) {
      const errorResponse = transformZodError(
        validation.error,
        req.body
      ).toObject();
      res.status(400).json(errorResponse);
      return;
    }

    next();
  };
}

export function verifySessionToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    req.decodedToken = jwt.verify(req.cookies.jwt, SECRET_KEY);
    next();
  } catch (error: any) {
    const errorResponse = new AppError({
      message: "Access denied",
      statusCode: 401,
      isOperational: true,
      originalError: error,
    });

    res.clearCookie("jwt");
    res.status(401).json(errorResponse.toObject());
  }
}
