import { AppError } from '../middleware/error-handler';

/**
 * Database error codes and their meanings
 */
enum PostgresErrorCode {
  UNIQUE_VIOLATION = '23505',
  FOREIGN_KEY_VIOLATION = '23503',
  CHECK_VIOLATION = '23514',
  NOT_NULL_VIOLATION = '23502',
  CONNECTION_FAILURE = '08006',
  CONNECTION_EXCEPTION = '08000',
  INSUFFICIENT_RESOURCES = '53000',
  DISK_FULL = '53100',
  DEADLOCK_DETECTED = '40P01'
}

/**
 * Handles PostgreSQL database errors and converts them to application errors
 * @param error The database error to handle
 * @returns An AppError with appropriate status code and message
 */
export function handleDatabaseError(error: any): AppError {
  console.error('Database error:', error);
  
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }
  
  // Check if it's a PostgreSQL error with a code
  if (error.code) {
    switch (error.code) {
      case PostgresErrorCode.UNIQUE_VIOLATION:
        return new AppError('A record with this value already exists', 409);
        
      case PostgresErrorCode.FOREIGN_KEY_VIOLATION:
        return new AppError('Referenced record does not exist', 400);
        
      case PostgresErrorCode.CHECK_VIOLATION:
      case PostgresErrorCode.NOT_NULL_VIOLATION:
        return new AppError('Invalid data provided', 400);
        
      case PostgresErrorCode.CONNECTION_FAILURE:
      case PostgresErrorCode.CONNECTION_EXCEPTION:
        return new AppError('Database connection error', 503);
        
      case PostgresErrorCode.INSUFFICIENT_RESOURCES:
      case PostgresErrorCode.DISK_FULL:
        return new AppError('Server resource error', 503);
        
      case PostgresErrorCode.DEADLOCK_DETECTED:
        return new AppError('Database conflict error', 409);
    }
  }
  
  // Handle Drizzle ORM specific errors
  if (error.name === 'DrizzleError') {
    return new AppError('Database operation failed', 500);
  }
  
  // Default error
  return new AppError('Database operation failed', 500);
}

/**
 * Wraps a database operation in a try-catch block with error handling
 * @param operation The database operation to execute
 * @returns The result of the operation
 * @throws AppError with appropriate status code and message
 */
export async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw handleDatabaseError(error);
  }
}
