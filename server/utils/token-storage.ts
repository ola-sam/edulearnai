import { db } from '../db';
import { sql } from 'drizzle-orm';
import { randomBytes } from 'crypto';

/**
 * Token storage utility for password reset and other secure tokens
 * This implementation uses the database for persistence instead of in-memory storage
 */
export class TokenStorage {
  /**
   * Creates a new token with the given user ID and expiration time
   * @param userId The user ID associated with the token
   * @param expiresInHours Number of hours until the token expires
   * @returns The generated token
   */
  async createToken(userId: number, expiresInHours = 24): Promise<string> {
    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    
    // Calculate expiration time
    const expires = new Date();
    expires.setHours(expires.getHours() + expiresInHours);
    
    // Convert the date to an ISO string for the SQL query
    const expiresIso = expires.toISOString();
    
    // Store token in database
    await db.execute(sql`
      INSERT INTO reset_tokens (token, user_id, expires_at)
      VALUES (${token}, ${userId}, ${expiresIso})
    `);
    
    return token;
  }
  
  /**
   * Validates a token and returns the associated user ID if valid
   * @param token The token to validate
   * @returns The user ID associated with the token, or null if invalid
   */
  async validateToken(token: string): Promise<number | null> {
    const result = await db.execute<{ user_id: number }>(sql`
      SELECT user_id
      FROM reset_tokens
      WHERE token = ${token}
      AND expires_at > NOW()
    `);
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].user_id;
  }
  
  /**
   * Invalidates a token after it has been used
   * @param token The token to invalidate
   */
  async invalidateToken(token: string): Promise<void> {
    await db.execute(sql`
      DELETE FROM reset_tokens
      WHERE token = ${token}
    `);
  }
  
  /**
   * Cleans up expired tokens from the database
   */
  async cleanupExpiredTokens(): Promise<void> {
    await db.execute(sql`
      DELETE FROM reset_tokens
      WHERE expires_at < NOW()
    `);
  }
}

export const tokenStorage = new TokenStorage();
