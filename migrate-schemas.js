const { drizzle } = require('drizzle-orm/postgres-js');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const postgres = require('postgres');
require('dotenv').config();

async function runMigration() {
  console.log('Starting database migration...');
  
  // Connect to the database
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  // Single connection instance
  const client = postgres(connectionString);
  
  try {
    // Create drizzle instance with the client
    const db = drizzle(client);
    
    // Run the migration
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: 'drizzle' });
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close the connection
    await client.end();
  }
}

runMigration();