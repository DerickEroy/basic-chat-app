import { InternalError, transformMongooseValidationError, transformMongoServerError } from "@common/errors";
import express from "express";
import mongoose from "mongoose";

export function errorHandler(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.dir(error);

    if (error instanceof mongoose.Error.ValidationError) {
        const errorResponse = transformMongooseValidationError(error).toObject();

        res.status(400).json(errorResponse);
    } else if (error instanceof mongoose.mongo.MongoServerError) {
        const errorResponse = transformMongoServerError(error).toObject();

        if (error.code === 11000) {
            // Duplicate Key Error
            res.status(409).json(errorResponse);
        } else {
            res.status(500).json(errorResponse);
        }
    } else {
        const errorResponse = (new InternalError(error)).toObject();
        
        res.status(500).json(errorResponse);
    }
}