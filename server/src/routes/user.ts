import express from "express";
import {
  authCheckController,
  loginController,
  registerController,
} from "@src/controllers/user";
import { userRegisterDTOSchema, userLoginDTOSchema } from "@libs/zod";
import {
  validateRequestBody,
  verifySessionToken,
} from "@src/common/middlewares";

export default function userRouter() {
  const router = express.Router();

  router.get("/auth-check", verifySessionToken, authCheckController);

  router.post(
    "/register",
    validateRequestBody(userRegisterDTOSchema),
    registerController
  );

  router.post(
    "/login",
    validateRequestBody(userLoginDTOSchema),
    loginController
  );

  return router;
}
