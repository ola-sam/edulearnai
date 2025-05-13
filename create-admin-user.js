#!/usr/bin/env node

import { db } from './server/db.js';
import { users } from './shared/schema.js';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64));
  return `${buf.toString("hex")}.${salt}`;
}

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Define admin user details
    const adminUsername = process.argv[2] || 'admin';
    const adminPassword = process.argv[3] || 'admin123';
    const firstName = process.argv[4] || 'Admin';
    const lastName = process.argv[5] || 'User';
    
    // Check if user already exists
    const existingUser = await db.select().from(users).where(users.username.equals(adminUsername));
    
    if (existingUser.length > 0) {
      console.log(`User '${adminUsername}' already exists. Updating to admin role...`);
      
      // Update existing user to admin role
      await db.update(users)
        .set({ 
          role: 'admin',
          isTeacher: true
        })
        .where(users.username.equals(adminUsername));
      
      console.log(`User '${adminUsername}' has been updated to admin role.`);
    } else {
      // Create new admin user
      const hashedPassword = await hashPassword(adminPassword);
      
      await db.insert(users).values({
        username: adminUsername,
        password: hashedPassword,
        firstName: firstName,
        lastName: lastName,
        grade: 12, // Default grade for admin
        points: 0,
        role: 'admin',
        isTeacher: true
      });
      
      console.log(`Admin user '${adminUsername}' has been created successfully.`);
    }
    
    console.log('You can now log in with these credentials:');
    console.log(`Username: ${adminUsername}`);
    console.log(`Password: ${adminPassword}`);
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Close the database connection
    process.exit(0);
  }
}

// Run the function
createAdminUser();
