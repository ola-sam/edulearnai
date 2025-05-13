import { db } from './db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

/**
 * Hash a password using scrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

/**
 * Create or update an admin user
 */
export async function createAdminUser(
  username: string = 'admin',
  password: string = 'admin123',
  firstName: string = 'Admin',
  lastName: string = 'User'
): Promise<void> {
  try {
    console.log('Checking for admin user...');
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    
    if (existingUser.length > 0) {
      console.log(`User '${username}' already exists. Updating to admin role...`);
      
      // Update existing user to admin role
      await db.update(users)
        .set({ 
          role: 'admin',
          isTeacher: true
        })
        .where(eq(users.username, username));
      
      console.log(`User '${username}' has been updated to admin role.`);
    } else {
      // Create new admin user
      const hashedPassword = await hashPassword(password);
      
      await db.insert(users).values({
        username,
        password: hashedPassword,
        firstName,
        lastName,
        grade: 12, // Default grade for admin
        points: 0,
        role: 'admin',
        isTeacher: true
      });
      
      console.log(`Admin user '${username}' has been created successfully.`);
    }
    
    console.log('Admin user credentials:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}
