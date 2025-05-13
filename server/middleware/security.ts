import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { SessionData } from 'express-session';

// Extend SessionData to include our custom properties
declare module 'express-session' {
  interface SessionData {
    csrfToken?: string;
  }
}

/**
 * Middleware to add security headers to responses
 * Protects against various web vulnerabilities
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Generate a nonce for Content-Security-Policy
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'`);
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

/**
 * Middleware to check for CSRF token
 * Protects against Cross-Site Request Forgery attacks
 */
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip for GET, HEAD, OPTIONS requests as they should be idempotent
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
  const sessionToken = req.session?.csrfToken;
  
  if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
    return res.status(403).json({
      error: {
        message: 'CSRF token validation failed',
        status: 403
      }
    });
  }
  
  next();
};

/**
 * Middleware to generate and set CSRF token
 */
export const setCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
  }
  
  // Make CSRF token available to templates
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

/**
 * Middleware to check if user is authenticated
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  res.status(401).json({
    error: {
      message: 'Authentication required',
      status: 401
    }
  });
};

/**
 * Middleware to check if user has admin role
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user?.role === 'admin') {
    return next();
  }
  
  res.status(403).json({
    error: {
      message: 'Admin access required',
      status: 403
    }
  });
};

/**
 * Middleware to check if user has teacher role
 */
export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && (req.user?.isTeacher || req.user?.role === 'admin')) {
    return next();
  }
  
  res.status(403).json({
    error: {
      message: 'Teacher access required',
      status: 403
    }
  });
};
