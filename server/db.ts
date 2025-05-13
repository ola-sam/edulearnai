import * as schema from "@shared/schema";
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Set default DATABASE_URL for local development if not provided
if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL not found in environment, using default local connection");
  process.env.DATABASE_URL = "postgres://localhost:5432/edulearn";
}

// Create connection client with error handling
export const client = postgres(process.env.DATABASE_URL, { 
  max: 20, // Maximum number of clients in the pool
  idle_timeout: 30, // How long a client is allowed to remain idle before being closed (in seconds)
  connect_timeout: 5, // How long to wait for a connection to become available (in seconds)
});

// Create a function to test the database connection
export async function testDatabaseConnection() {
  try {
    // Test the connection with a simple query
    await client`SELECT 1`;
    console.log('✅ Database connection successful');
    return true;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Database connection failed:', errorMessage);
    return false;
  }
}

// Initialize Drizzle ORM with the connection pool
export const db = drizzle(client, { schema });

// Export the schema for use in other files
export { schema };
