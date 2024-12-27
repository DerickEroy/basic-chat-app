import type * as jwt from "jsonwebtoken";
import type { Role } from "@src/types/common";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    role: Role;
  }
}
