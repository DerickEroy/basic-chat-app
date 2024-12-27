import express from "express";
import { loginController, registerController } from "@src/controllers/user";
import { userRegisterDTOSchema, userLoginDTOSchema } from "@libs/zod";
import { validateRequestBody } from "@src/common/middlewares";
import { findOneController } from "@src/controllers/(shared)";
import { UserModel } from "@src/models/user";

export default function userRouter() {
  const router = express.Router();

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

  router.get("/findOne", findOneController(UserModel));

  return router;
}
