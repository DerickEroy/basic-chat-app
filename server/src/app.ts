import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "@routes/user";
import { errorHandler } from "@src/common/middlewares";
import { SECRET_KEY } from "./common/config";

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser(SECRET_KEY));
app.use('/users', userRouter());
app.use(errorHandler);

export default app;