import { AppError } from "@common/errors";
import express from "express";

export function errorHandler(error: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.dir(error);

    if (error instanceof AppError) {
        res.status(error.statusCode).json(error.toObject());
    } else {
        const errorResponse = AppError.default(error).toObject();
        res.status(500).json(errorResponse);
    }
}