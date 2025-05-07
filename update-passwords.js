import pg from 'pg';
import crypto from 'crypto';
import { promisify } from 'util';

const { Pool } = pg;
const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function updateUserPassword() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    const hashedPassword = await hashPassword('password123');
    console.log('Hashed password:', hashedPassword);
    
    await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [hashedPassword, 'testuser']
    );
    console.log('Updated testuser password');
    
    await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [hashedPassword, 'john.doe']
    );
    console.log('Updated john.doe password');
    
    await pool.query(
      'UPDATE users SET password = $1 WHERE username = $2',
      [hashedPassword, 'jane.smith']
    );
    console.log('Updated jane.smith password');
  } catch (err) {
    console.error('Error updating password:', err);
  } finally {
    await pool.end();
  }
}

updateUserPassword();