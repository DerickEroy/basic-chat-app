import express from "express";
import mongoose from "mongoose";
import { ZodSchema } from "zod";
import { AppError, transformMongooseValidationError, transformZodError } from "@common/errors";

export function errorHandler(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
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
    return function (req: express.Request, res: express.Response, next: express.NextFunction) {
        const validation = schema.safeParse(req.body);

        if (!validation.success) {
            const errorResponse = transformZodError(validation.error, req.body).toObject();
            res.status(400).json(errorResponse);
            return;
        }

        next();
    }
}