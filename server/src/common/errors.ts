import type mongoose from "mongoose";
import type { Cause } from "./types";

export class AppError extends Error {
    name = this.constructor.name;
    statusCode: number;
    isOperational: boolean;
    originalError?: Error;
    cause?: Cause;

    constructor(
        { message, statusCode, isOperational, originalError, cause }: {
            message: string;
            statusCode: number;
            isOperational: boolean;
            originalError?: Error;
            cause?: Cause;
        }
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.originalError = originalError;
        this.cause = cause;
    }

    toObject() {
        return {
            ...this,
            message: this.message
        }
    }

    /** Creates an instance of AppError from a native js Error */
    static default(error: Error) {
        return new AppError({
            message: error.message,
            statusCode: 500,
            isOperational: false,
            originalError: error
        });
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

    return new AppError({
        message: error.message,
        statusCode: 400,
        isOperational: true,
        originalError: error,
        cause
    });
}

export function transformMongoServerError(error: mongoose.mongo.MongoServerError) {

    /** 11000 DuplicateKey */
    if (error.code === 11000) {
        const keyValueEntry = Object.entries(error.keyValue);

        const cause: Cause = [];

        cause.push({
            path: keyValueEntry[0][0].split('.'),
            value: keyValueEntry[0][1]
        });

        return new AppError({
            message: error.message,
            statusCode: 409,
            isOperational: true,
            originalError: error,
            cause
        });
    } else {
        return new AppError({
            message: error.message,
            statusCode: 500,
            isOperational: false,
            originalError: error
        });
    }
}