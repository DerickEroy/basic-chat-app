import { AppError } from "@src/common/errors";
import express from "express";
import mongoose from "mongoose";

export function findOneController(model: mongoose.Model<any>) {
  return async function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const result = await model.findOne(req.query);

      if (!result) {
        throw new AppError({
          message: "Document could not be found",
          statusCode: 404,
          isOperational: true,
        });
      }

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
