import express from "express";

export function expressAdapter(status: number, service: Function) {
    return async function(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        try {
            const result = await service(req.body);
            res.status(status).json(result);
        } catch (error) {
            next(error);
        }
    }
}