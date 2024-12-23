import express from "express";
import { loginController, registerController } from "@src/controllers/user";

export default function userRouter() {
    const router = express.Router();

    router.post("/register", registerController);

    router.post("/login", loginController);

    return router;
}