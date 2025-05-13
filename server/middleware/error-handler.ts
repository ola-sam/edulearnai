import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates this is a known operational error
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * Handles different types of errors and sends appropriate responses
 */
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Default error values
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  let errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  let isOperational = err.isOperational || false;
  
  // Log error details
  console.error(`Error ID: ${errorId}`, {
    path: req.path,
    method: req.method,
    statusCode,
    message,
    stack: err.stack,
    isOperational,
    timestamp: new Date().toISOString()
  });
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose/Zod validation error
    statusCode = 400;
    isOperational = true;
  } else if (err.name === 'CastError') {
    // Mongoose cast error (e.g., invalid ObjectId)
    statusCode = 400;
    message = 'Invalid data format';
    isOperational = true;
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate value error';
    isOperational = true;
  } else if (err.name === 'JsonWebTokenError') {
    // JWT validation error
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    isOperational = true;
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired error
    statusCode = 401;
    message = 'Your token has expired. Please log in again.';
    isOperational = true;
  }
  
  // Send error response
  const errorResponse = {
    error: {
      message,
      status: statusCode,
      id: errorId,
      ...(process.env.NODE_ENV === 'development' && !isOperational ? { stack: err.stack } : {})
    }
  };
  
  res.status(statusCode).json(errorResponse);
};

/**
 * Async error handler wrapper
 * Catches errors in async route handlers and passes them to the global error handler
 */
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
