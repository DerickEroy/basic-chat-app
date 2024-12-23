import { loginUseCase, registerUseCase } from "@src/useCases/user";
import express from "express";

export async function registerController(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const result = await registerUseCase(req.body);
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function loginController(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const result = await loginUseCase(req.body);

        res.cookie('jwt', result, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(204);
    } catch (error) {
        next(error);
    }
}