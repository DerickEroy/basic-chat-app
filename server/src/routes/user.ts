import express from "express";
import * as services from "@services/user";
import { expressAdapter } from "@common/adapters";

export default function userRouter() {
    const router = express.Router();

    router.post("/register", expressAdapter(201, services.register));

    return router;
}