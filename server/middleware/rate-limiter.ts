import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Create different rate limiters for different endpoints
const loginLimiter = new RateLimiterMemory({
  points: 5, // 5 attempts
  duration: 60 * 15, // per 15 minutes
  blockDuration: 60 * 15, // Block for 15 minutes
});

const apiLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 60, // per 1 minute
});

/**
 * Rate limiter middleware for login attempts
 * Prevents brute force attacks by limiting login attempts
 */
export const loginRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use IP address as key for rate limiting
    const key = req.ip;
    await loginLimiter.consume(key);
    next();
  } catch (error: unknown) {
    // Rate limit exceeded
    const rateLimiterError = error as { msBeforeNext: number };
    const retryAfter = Math.floor(rateLimiterError.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(retryAfter));
    res.status(429).json({
      error: {
        message: 'Too many login attempts, please try again later',
        status: 429,
        retryAfter
      }
    });
  }
};

/**
 * General API rate limiter
 * Prevents DoS attacks by limiting overall API usage
 */
export const generalRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use IP address as key for rate limiting
    const key = req.ip;
    await apiLimiter.consume(key);
    next();
  } catch (error: unknown) {
    // Rate limit exceeded
    const rateLimiterError = error as { msBeforeNext: number };
    const retryAfter = Math.floor(rateLimiterError.msBeforeNext / 1000) || 1;
    res.set('Retry-After', String(retryAfter));
    res.status(429).json({
      error: {
        message: 'Too many requests, please try again later',
        status: 429,
        retryAfter
      }
    });
  }
};
