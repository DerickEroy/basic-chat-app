import mongoose from "mongoose";
import type { ZodError } from "zod";
import type { Cause } from "../types/common";

export class AppError extends Error {
  name = this.constructor.name;
  statusCode: number;
  isOperational: boolean;
  cause?: Cause;
  originalError?: Error;

  constructor({
    message,
    statusCode,
    isOperational,
    originalError,
    cause,
  }: {
    message: string;
    statusCode: number;
    isOperational: boolean;
    originalError?: Error;
    cause?: Cause;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.originalError = originalError;
    this.cause = cause;
  }

  toObject() {
    return {
      ...this,
      message: this.message,
    };
  }

  static default(error: Error) {
    return new AppError({
      message: error.message,
      statusCode: 500,
      isOperational: false,
      originalError: error,
    });
  }
}

export function transformMongooseValidationError(
  error: mongoose.Error.ValidationError
) {
  const cause: Cause = [];

  for (const [path, details] of Object.entries(error.errors)) {
    cause.push({
      path: path.split("."),
      value: details.value,
      message: details.message,
    });
  }

  return new AppError({
    message: "Validation failed",
    statusCode: 400,
    isOperational: true,
    originalError: error,
    cause,
  });
}

export function transformZodError<Data extends Record<string, any>>(
  error: ZodError<Data>,
  data: Data
) {
  const cause: Cause = [];

  for (const issue of error.issues) {
    let value = data;

    for (const subPath of issue.path) {
      value = value[subPath];
    }

    cause.push({
      path: issue.path,
      message: issue.message,
      value,
    });
  }

  return new AppError({
    message: "Validation failed",
    statusCode: 400,
    isOperational: true,
    originalError: error,
    cause,
  });
}
