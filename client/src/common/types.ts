export interface AppError {
  name: string;
  statusCode: number;
  isOperational: boolean;
  cause?: { path: (string | number)[]; value?: unknown; message?: string }[];
  originalError?: Error;
}

export interface RegisterForm {
  fName: string;
  lName: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

// Custom

export type RegisterFormWithConfirmPassword = RegisterForm & {
  confirmPassword: string;
};
