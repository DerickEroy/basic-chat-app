import { appErrorSchema } from "../libs/zod";
import type { AppError } from "../types/common";

export class ParsedAppError implements AppError {
  name: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
  cause?: { path: (string | number)[]; value?: unknown; message?: string }[];
  orginalError?: Error;

  constructor({
    name,
    message,
    statusCode,
    isOperational,
    cause,
    originalError,
  }: AppError) {
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.cause = cause;
    this.orginalError = originalError;
  }

  static parse(error: unknown, parseErrorMessage?: string) {
    const appError = appErrorSchema.safeParse(error);

    if (!appError.success) {
      throw new Error(
        parseErrorMessage ?? "Failed to parse the error response."
      );
    }

    return new ParsedAppError(appError.data);
  }

  getPropertyCause(property: string) {
    if (this.cause === undefined) return null;
    return this.cause.find((cause) => cause.path.slice(-1)[0] === property);
  }
}
