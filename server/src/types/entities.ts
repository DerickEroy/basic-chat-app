import type { Role } from "./common";

export interface User {
  fName: string;
  lName: string;
  email: string;
  auth: {
    role: Role;
    password: string;
    token: null | string;
  };
}
