export interface AppError {
  name: string;
  message: string;
  statusCode: number;
  isOperational: boolean;
  cause?: { path: (string | number)[]; value?: unknown; message?: string }[];
  originalError?: Error;
}
