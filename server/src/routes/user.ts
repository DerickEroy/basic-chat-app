import express from "express";
import { loginController, registerController } from "@src/controllers/user";
import { userRegisterDTOSchema, userLoginDTOSchema } from "@libs/zod";
import { validateRequestBody } from "@src/common/middlewares";

export default function userRouter() {
    const router = express.Router();

    router.post("/register", validateRequestBody(userRegisterDTOSchema), registerController);

    router.post("/login", validateRequestBody(userLoginDTOSchema), loginController);

    return router;
}