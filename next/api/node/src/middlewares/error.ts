import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http-error.js';

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      error: error.statusCode === 401 ? 'Unauthorized' : 'Error',
    });
    return;
  }

  console.error(error);
  res.status(500).json({
    statusCode: 500,
    message: 'Internal Server Error',
    error: 'Error',
  });
};
