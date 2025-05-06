// Script to migrate database without data loss
import { storage } from './server/storage.js';
import { db } from './server/db.js';
import { users, teachers, classes, assignments, classEnrollments } from './shared/schema.js';
import { eq } from 'drizzle-orm';

async function migrateDatabase() {
  try {
    console.log("Starting database migration...");
    
    // Check if the teacher tables exist by trying to select from them
    let hasTeacherTables = false;
    try {
      const teachers = await db.query.teachers.findMany();
      if (teachers) {
        hasTeacherTables = true;
        console.log("Teacher tables already exist");
      }
    } catch (e) {
      console.log("Teacher tables need to be created");
    }
    
    if (!hasTeacherTables) {
      console.log("Creating teacher-related schema...");
      
      // Create tables for teacher functionality
      await db.execute(`
        CREATE TABLE IF NOT EXISTS teachers (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL UNIQUE,
          bio TEXT,
          subjects JSONB,
          grades JSONB,
          credentials JSONB,
          office_hours JSONB,
          avatar_url TEXT
        );
        
        CREATE TABLE IF NOT EXISTS classes (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          teacher_id INTEGER NOT NULL,
          grade INTEGER NOT NULL,
          subject TEXT NOT NULL,
          academic_year TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          schedule JSONB,
          class_code TEXT NOT NULL UNIQUE,
          is_active BOOLEAN NOT NULL DEFAULT TRUE
        );
        
        CREATE TABLE IF NOT EXISTS class_enrollments (
          id SERIAL PRIMARY KEY,
          class_id INTEGER NOT NULL,
          student_id INTEGER NOT NULL,
          enrolled_at TIMESTAMP NOT NULL DEFAULT NOW(),
          status TEXT NOT NULL DEFAULT 'active',
          UNIQUE(class_id, student_id)
        );
        
        CREATE TABLE IF NOT EXISTS assignments (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          instructions TEXT NOT NULL,
          class_id INTEGER NOT NULL,
          teacher_id INTEGER NOT NULL,
          lesson_id INTEGER,
          quiz_id INTEGER,
          due_date TIMESTAMP NOT NULL,
          assigned_date TIMESTAMP NOT NULL DEFAULT NOW(),
          points INTEGER NOT NULL DEFAULT 100,
          status TEXT NOT NULL DEFAULT 'active',
          resources JSONB,
          requirements JSONB
        );
        
        CREATE TABLE IF NOT EXISTS assignment_submissions (
          id SERIAL PRIMARY KEY,
          assignment_id INTEGER NOT NULL,
          student_id INTEGER NOT NULL,
          submitted_at TIMESTAMP NOT NULL DEFAULT NOW(),
          content TEXT,
          attachments JSONB,
          status TEXT NOT NULL DEFAULT 'submitted',
          grade INTEGER,
          feedback TEXT,
          graded_by INTEGER,
          graded_at TIMESTAMP,
          UNIQUE(assignment_id, student_id)
        );
        
        CREATE TABLE IF NOT EXISTS lesson_plans (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          teacher_id INTEGER NOT NULL,
          class_id INTEGER NOT NULL,
          subject TEXT NOT NULL,
          grade INTEGER NOT NULL,
          objectives JSONB NOT NULL,
          materials JSONB,
          procedure JSONB NOT NULL,
          assessment JSONB,
          notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
          status TEXT NOT NULL DEFAULT 'draft',
          duration INTEGER NOT NULL,
          lesson_date DATE NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS analytics (
          id SERIAL PRIMARY KEY,
          class_id INTEGER NOT NULL,
          teacher_id INTEGER NOT NULL,
          period TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          metrics JSONB NOT NULL,
          insights JSONB,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        
        CREATE TABLE IF NOT EXISTS announcements (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          teacher_id INTEGER NOT NULL,
          class_id INTEGER,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          expires_at TIMESTAMP,
          priority TEXT NOT NULL DEFAULT 'normal',
          attachments JSONB
        );
      `);
      
      console.log("Created teacher-related tables");
    }
    
    // Check for existing teacher users
    const teacherUsers = await db.select().from(users).where(eq(users.isTeacher, true));
    
    if (teacherUsers.length === 0) {
      console.log("No teacher users found, creating demo teacher account");
      
      // Create a demo teacher user if none exists
      const demoTeacher = await storage.createUser({
        username: "teacher.demo",
        password: "password123", // In real app, this would be properly hashed
        firstName: "Demo",
        lastName: "Teacher",
        grade: 0, // Not applicable for teachers
        role: "teacher",
        isTeacher: true
      });
      
      // Create teacher profile
      await storage.createTeacher({
        userId: demoTeacher.id,
        bio: "Experienced mathematics and science teacher with 10 years of classroom experience.",
        subjects: ["Mathematics", "Science"],
        grades: [5, 6, 7, 8],
        credentials: { degree: "M.Ed. Curriculum and Instruction", certifications: ["Mathematics 5-9", "Science 5-9"] }
      });
      
      console.log(`Created demo teacher with ID ${demoTeacher.id}`);
    } else {
      console.log(`Found ${teacherUsers.length} existing teacher users`);
    }
    
    console.log("Database migration completed successfully");
  } catch (error) {
    console.error("Database migration failed:", error);
  }
}

migrateDatabase();