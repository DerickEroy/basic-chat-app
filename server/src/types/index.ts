/** Role of user */
export type Role = "user" | "admin";

/** Cause of app error */
export type Cause = {
  path: (string | number)[];
  value?: unknown;
  message?: string;
}[];

export interface User {
  fName: string;
  lName: string;
  email: string;
  auth: {
    role: Role;
    password: string;
    sessionToken: null | string;
  };
}

export interface RegisterUserDTO {
  fName: string;
  lName: string;
  email: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
