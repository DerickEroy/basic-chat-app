export type Role = "user" | "admin";

export type Cause = {
  path: (string | number)[];
  value?: unknown;
  message?: string;
}[];
