import type mongoose from "mongoose";
import type { Cause } from "./types";

export class AppError extends Error {
    name = this.constructor.name;
    isOperational: boolean;

    constructor(message: string, isOperational: boolean) {
        super(message);
        this.isOperational = isOperational;
    }

    toObject() {
        return {
            ...this,
            message: this.message
        }
    }
}

export class InternalError extends AppError {
    error: Error;

    constructor(error: Error) {
        super(error.message, false);
        this.error = error;
    }
}

export class ValidationError extends AppError {
    cause: Cause;

    constructor(message: string, cause: Cause) {
        super(message, true);
        this.cause = cause;
    }
}

export class DuplicateError extends AppError {
    cause: Cause;

    constructor(message: string, cause: Cause) {
        super(message, true);
        this.cause = cause;
    }
}

export function transformMongooseValidationError(error: mongoose.Error.ValidationError) {
    const cause: Cause = [];

    for (const [path, details] of Object.entries(error.errors)) {
        cause.push({
            path: path.split('.'),
            value: details.value,
            message: details.message
        });
    }

    return new ValidationError(error.message, cause);
}

export function transformMongoServerError(error: mongoose.mongo.MongoServerError) {
    if (error.code === 11000) {
        // Duplicate Key Error
        const keyValueEntry = Object.entries(error.keyValue);

        const cause: Cause = [];

        cause.push({
            path: keyValueEntry[0][0].split('.'),
            value: keyValueEntry[0][1]
        });

        return new DuplicateError(error.message, cause);
    } else {
        return new InternalError(error);
    }
}