import type * as express from "@src/types/express";
import type { JwtPayload } from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    decodedToken?: string | JwtPayload;
  }
}
