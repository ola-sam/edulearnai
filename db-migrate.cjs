// CommonJS-style migration script
const { Pool } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { sql } = require('drizzle-orm');
const ws = require('ws');

// Configure the neon client for WebSocket
const { neonConfig } = require('@neondatabase/serverless');
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

async function migrateSchema() {
  console.log('Starting schema migration...');
  
  try {
    // Add isTeacher and role columns to users table if they don't exist
    await db.execute(sql`
      ALTER TABLE IF EXISTS users 
      ADD COLUMN IF NOT EXISTS is_teacher BOOLEAN DEFAULT false NOT NULL,
      ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' NOT NULL
    `);
    console.log('Updated users table');

    // Create teachers table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS teachers (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
        bio TEXT,
        subjects JSONB,
        grades JSONB,
        credentials JSONB,
        office_hours JSONB,
        avatar_url TEXT
      )
    `);
    console.log('Created teachers table');

    // Create classes table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        teacher_id INTEGER NOT NULL REFERENCES users(id),
        grade INTEGER NOT NULL,
        subject TEXT NOT NULL,
        academic_year TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        schedule JSONB,
        class_code TEXT NOT NULL UNIQUE,
        is_active BOOLEAN DEFAULT true NOT NULL
      )
    `);
    console.log('Created classes table');

    // Create class_enrollments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS class_enrollments (
        id SERIAL PRIMARY KEY,
        class_id INTEGER NOT NULL REFERENCES classes(id),
        student_id INTEGER NOT NULL REFERENCES users(id),
        enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
        status TEXT DEFAULT 'active' NOT NULL,
        UNIQUE(class_id, student_id)
      )
    `);
    console.log('Created class_enrollments table');

    // Create assignments table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        instructions TEXT NOT NULL,
        class_id INTEGER NOT NULL REFERENCES classes(id),
        teacher_id INTEGER NOT NULL REFERENCES users(id),
        lesson_id INTEGER REFERENCES lessons(id),
        quiz_id INTEGER REFERENCES quizzes(id),
        due_date TIMESTAMP NOT NULL,
        assigned_date TIMESTAMP NOT NULL DEFAULT NOW(),
        points INTEGER DEFAULT 100 NOT NULL,
        status TEXT DEFAULT 'active' NOT NULL,
        resources JSONB,
        requirements JSONB
      )
    `);
    console.log('Created assignments table');

    // Create assignment_submissions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS assignment_submissions (
        id SERIAL PRIMARY KEY,
        assignment_id INTEGER NOT NULL REFERENCES assignments(id),
        student_id INTEGER NOT NULL REFERENCES users(id),
        submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
        content TEXT,
        attachments JSONB,
        status TEXT DEFAULT 'submitted' NOT NULL,
        grade INTEGER,
        feedback TEXT,
        graded_by INTEGER REFERENCES users(id),
        graded_at TIMESTAMP,
        UNIQUE(assignment_id, student_id)
      )
    `);
    console.log('Created assignment_submissions table');

    // Create lesson_plans table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS lesson_plans (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        teacher_id INTEGER NOT NULL REFERENCES users(id),
        class_id INTEGER NOT NULL REFERENCES classes(id),
        subject TEXT NOT NULL,
        grade INTEGER NOT NULL,
        objectives JSONB NOT NULL,
        materials JSONB,
        procedure JSONB NOT NULL,
        assessment JSONB,
        notes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        status TEXT DEFAULT 'draft' NOT NULL,
        duration INTEGER NOT NULL,
        lesson_date DATE NOT NULL
      )
    `);
    console.log('Created lesson_plans table');

    // Create analytics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS analytics (
        id SERIAL PRIMARY KEY,
        class_id INTEGER NOT NULL REFERENCES classes(id),
        teacher_id INTEGER NOT NULL REFERENCES users(id),
        period TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        metrics JSONB NOT NULL,
        insights JSONB,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Created analytics table');

    // Create announcements table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        teacher_id INTEGER NOT NULL REFERENCES users(id),
        class_id INTEGER REFERENCES classes(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP,
        priority TEXT DEFAULT 'normal' NOT NULL,
        attachments JSONB
      )
    `);
    console.log('Created announcements table');

    console.log('Schema migration completed successfully!');
  } catch (error) {
    console.error('Error during schema migration:', error);
    throw error;
  } finally {
    // Close the pool when done
    await pool.end();
  }
}

// Run the migration
migrateSchema()
  .then(() => {
    console.log('All done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });