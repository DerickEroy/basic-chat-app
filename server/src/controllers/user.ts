import express from "express";
import { loginUseCase, registerUseCase } from "@src/useCases/user";
import { UserModel } from "@src/models/user";

export async function registerController(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const result = await registerUseCase(req.body, UserModel);

        res.cookie('jwt', result, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(201).send();
    } catch (error) {
        next(error);
    }
}

export async function loginController(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const result = await loginUseCase(req.body, UserModel);

        res.cookie('jwt', result, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).send();
    } catch (error) {
        next(error);
    }
}