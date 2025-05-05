import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  grade: integer("grade").notNull(),
  points: integer("points").default(0).notNull(),
  avatarUrl: text("avatar_url"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  grade: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Subjects
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").notNull().default("#3B82F6"), // Primary color by default
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  icon: true,
  color: true,
});

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

// Lessons
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  subjectId: integer("subject_id").notNull(),
  grade: integer("grade").notNull(),
  duration: integer("duration").notNull(), // in minutes
  difficulty: integer("difficulty").notNull(), // 1-5
  downloadSize: integer("download_size"), // in KB
  downloadUrl: text("download_url"),
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  title: true,
  description: true,
  content: true,
  subjectId: true,
  grade: true,
  duration: true,
  difficulty: true,
  downloadSize: true,
  downloadUrl: true,
});

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

// Quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  lessonId: integer("lesson_id").notNull(),
  questions: jsonb("questions").notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).pick({
  title: true,
  description: true,
  lessonId: true,
  questions: true,
});

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

// User Progress
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  completed: boolean("completed").default(false).notNull(),
  timeSpent: integer("time_spent").default(0).notNull(), // in seconds
  lastAccessed: timestamp("last_accessed").notNull(),
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  lessonId: true,
  completed: true,
  timeSpent: true,
  lastAccessed: true,
});

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

// Quiz Results
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quizId: integer("quiz_id").notNull(),
  score: integer("score").notNull(),
  maxScore: integer("max_score").notNull(),
  dateTaken: timestamp("date_taken").notNull(),
  answers: jsonb("answers").notNull(),
});

export const insertQuizResultSchema = createInsertSchema(quizResults).pick({
  userId: true,
  quizId: true,
  score: true,
  maxScore: true,
  dateTaken: true,
  answers: true,
});

export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;
export type QuizResult = typeof quizResults.$inferSelect;

// Badges
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  criteria: jsonb("criteria").notNull(),
});

export const insertBadgeSchema = createInsertSchema(badges).pick({
  name: true,
  description: true,
  icon: true,
  color: true,
  criteria: true,
});

export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type Badge = typeof badges.$inferSelect;

// User Badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  dateEarned: timestamp("date_earned").notNull(),
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).pick({
  userId: true,
  badgeId: true,
  dateEarned: true,
});

export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
export type UserBadge = typeof userBadges.$inferSelect;

// Downloaded Content
export const downloadedContent = pgTable("downloaded_content", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  lessonId: integer("lesson_id").notNull(),
  downloadedAt: timestamp("downloaded_at").notNull(),
  status: text("status").notNull(), // "completed", "in_progress", "paused"
  progress: integer("progress").default(0).notNull(), // percentage
});

export const insertDownloadedContentSchema = createInsertSchema(downloadedContent).pick({
  userId: true,
  lessonId: true,
  downloadedAt: true,
  status: true,
  progress: true,
});

export type InsertDownloadedContent = z.infer<typeof insertDownloadedContentSchema>;
export type DownloadedContent = typeof downloadedContent.$inferSelect;
