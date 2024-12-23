import { AppError, transformMongooseValidationError, transformMongoServerError } from "@common/errors";
import express from "express";
import mongoose from "mongoose";

export function errorHandler(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.dir(error);

    if (error instanceof mongoose.Error.ValidationError) {
        const errorResponse = transformMongooseValidationError(error).toObject();

        res.status(errorResponse.statusCode).json(errorResponse);
    } else if (error instanceof mongoose.mongo.MongoServerError) {
        const errorResponse = transformMongoServerError(error).toObject();

        res.status(errorResponse.statusCode).json(errorResponse);
    } else if (error instanceof AppError) {
        res.status(error.statusCode).json(error);
    } else {
        const errorResponse = AppError.default(error).toObject();
        
        res.status(500).json(errorResponse);
    }
}