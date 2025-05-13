import { Router } from 'express';
import { z } from 'zod';
import { storage } from '../storage';
import { validate } from '../middleware/validation';
import { catchAsync, AppError } from '../middleware/error-handler';
import { scrypt, timingSafeEqual, randomBytes } from 'crypto';
import { promisify } from 'util';
import { eq } from 'drizzle-orm';
import { users } from '@shared/schema';
import { db } from '../db';
import { tokenStorage } from '../utils/token-storage';
import { csrfProtection } from '../middleware/security';
import { loginRateLimiter } from '../middleware/rate-limiter';

const router = Router();
const scryptAsync = promisify(scrypt);

// Helper functions for password handling
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

// Define validation schemas
const requestResetSchema = z.object({
  email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z.object({
  token: z.string().min(32, 'Invalid token'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// Request password reset with rate limiting to prevent abuse
router.post('/request', loginRateLimiter, validate(requestResetSchema), catchAsync(async (req, res) => {
  const { email } = req.body;
  
  // Find user by email (assuming email is stored in the username field)
  const user = await storage.getUserByUsername(email);
  
  // Always return success even if user not found (security best practice)
  if (!user) {
    return res.status(200).json({ 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  }
  
  // Generate and store reset token in the database (24 hours expiration)
  const token = await tokenStorage.createToken(user.id, 24);
  
  // In a real app, send email with reset link
  // For development, just return the token
  if (process.env.NODE_ENV === 'development') {
    return res.status(200).json({ 
      message: 'Password reset requested successfully',
      // Only include token in development mode
      token,
      resetUrl: `${req.protocol}://${req.get('host')}/reset-password?token=${token}`
    });
  }
  
  res.status(200).json({ 
    message: 'If an account with that email exists, a password reset link has been sent.' 
  });
}));

// Reset password with token
// In development mode, we bypass CSRF protection for testing
// In production, CSRF protection is essential
router.post('/reset', 
  process.env.NODE_ENV === 'development' ? (req, res, next) => next() : csrfProtection, 
  validate(resetPasswordSchema), 
  catchAsync(async (req, res) => {
  const { token, password } = req.body;
  
  // Validate the token and get the associated user ID
  const userId = await tokenStorage.validateToken(token);
  if (!userId) {
    throw new AppError('Invalid or expired password reset token', 400);
  }
  
  // Get user
  const user = await storage.getUser(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Update password
  const hashedPassword = await hashPassword(password);
  
  // Update user password in database
  await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, user.id));
  
  // Invalidate the used token
  await tokenStorage.invalidateToken(token);
  
  // Schedule cleanup of expired tokens
  setTimeout(async () => {
    await tokenStorage.cleanupExpiredTokens();
  }, 0);
  
  res.status(200).json({ message: 'Password has been reset successfully' });
}));

// Change password (for authenticated users)
router.post('/change', csrfProtection, catchAsync(async (req, res) => {
  if (!req.isAuthenticated()) {
    throw new AppError('Authentication required', 401);
  }
  
  // Validate the password change request
  const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });
  
  const { currentPassword, newPassword } = passwordChangeSchema.parse(req.body);
  
  // Get current user
  const user = await storage.getUser(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  // Verify current password
  const isPasswordValid = await comparePasswords(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }
  
  // Hash new password
  const hashedPassword = await hashPassword(newPassword);
  
  // Update user password
  await db.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, user.id));
  
  res.status(200).json({ message: 'Password changed successfully' });
}));

export default router;
