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