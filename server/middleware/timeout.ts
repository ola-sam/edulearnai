import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to handle request timeouts
 * @param timeout Timeout in milliseconds (default: 30000ms = 30s)
 */
export const requestTimeout = (timeout: number = 30000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set a timeout for the request
    const timeoutId = setTimeout(() => {
      // Only send timeout response if headers haven't been sent yet
      if (!res.headersSent) {
        res.status(503).json({
          error: {
            message: 'Request timeout - the server took too long to respond',
            status: 503
          }
        });
      }
    }, timeout);
    
    // Clear the timeout when the response is sent
    res.on('finish', () => {
      clearTimeout(timeoutId);
    });
    
    // Clear the timeout if there's an error
    res.on('error', () => {
      clearTimeout(timeoutId);
    });
    
    next();
  };
};

/**
 * Middleware to handle connection closed errors
 */
export const connectionClosedHandler = (req: Request, res: Response, next: NextFunction) => {
  // Handle client disconnection
  req.on('close', () => {
    // If the client disconnects, we can stop processing
    req.aborted = true;
  });
  
  next();
};

/**
 * Utility to check if a request has been aborted
 * @param req Express request object
 */
export const isRequestAborted = (req: Request): boolean => {
  return req.aborted === true;
};
