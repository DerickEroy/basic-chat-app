import type { AppError } from "./types";

export class ParsedAppError {
  name: string;
  statusCode: number;
  isOperational: boolean;
  cause: { path: (string | number)[]; value?: unknown; message?: string }[];
  orginalError?: Error;

  constructor({
    name,
    statusCode,
    isOperational,
    cause,
    originalError,
  }: AppError) {
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.cause = cause;
    this.orginalError = originalError;
  }

  getPropertyCause(property: string) {
    return this.cause.find((cause) => cause.path.slice(-1)[0] === property);
  }
}