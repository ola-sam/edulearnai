import { pgTable, text, serial, integer, boolean, jsonb, timestamp, date, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
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
  role: text("role").default("student").notNull(), // "student", "teacher", "admin"
  isTeacher: boolean("is_teacher").default(false).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  grade: true,
  role: true,
  isTeacher: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Teachers (extends users)
export const teachers = pgTable("teachers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  bio: text("bio"),
  subjects: jsonb("subjects"),
  grades: jsonb("grades"),
  credentials: jsonb("credentials"),
  office_hours: jsonb("office_hours"),
  avatar_url: text("avatar_url"),
});

export const insertTeacherSchema = createInsertSchema(teachers).pick({
  userId: true,
  bio: true,
  subjects: true,
  grades: true,
  credentials: true,
  office_hours: true,
  avatar_url: true,
});

export type InsertTeacher = z.infer<typeof insertTeacherSchema>;
export type Teacher = typeof teachers.$inferSelect;

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

// Curriculum Documents for RAG
export const curriculumDocuments = pgTable("curriculum_documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  grade: integer("grade").notNull(),
  subject: text("subject").notNull(),
  documentType: text("document_type").notNull(), // "lesson_plan", "textbook", "worksheet", "reference", etc.
  metadata: jsonb("metadata"), // Additional info about the document
  vectorEmbedding: text("vector_embedding"), // OpenAI embedding as text (JSON stringified)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCurriculumDocumentSchema = createInsertSchema(curriculumDocuments).pick({
  title: true,
  content: true,
  grade: true, 
  subject: true,
  documentType: true,
  metadata: true,
  vectorEmbedding: true,
});

export type InsertCurriculumDocument = z.infer<typeof insertCurriculumDocumentSchema>;
export type CurriculumDocument = typeof curriculumDocuments.$inferSelect;

// Chat Messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  content: text("content").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  role: text("role").notNull(), // "user" or "assistant"
  subject: text("subject"),      // Optional subject context
  sources: jsonb("sources"),     // Optional document sources used in RAG
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  userId: true,
  content: true,
  timestamp: true,
  role: true,
  subject: true,
  sources: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Classes
export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  teacherId: integer("teacher_id").notNull(),
  grade: integer("grade").notNull(),
  subject: text("subject").notNull(),
  academicYear: text("academic_year").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  schedule: jsonb("schedule"),
  classCode: text("class_code").notNull().unique(), // For students to join
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertClassSchema = createInsertSchema(classes).pick({
  name: true,
  description: true,
  teacherId: true,
  grade: true,
  subject: true,
  academicYear: true,
  startDate: true,
  endDate: true,
  schedule: true,
  classCode: true,
  isActive: true,
});

export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;

// Class Enrollments (students in classes)
export const classEnrollments = pgTable("class_enrollments", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  studentId: integer("student_id").notNull(),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
  status: text("status").default("active").notNull(), // active, suspended, completed
}, (table) => {
  return {
    classStudentUnique: unique("class_student_unique").on(table.classId, table.studentId),
  };
});

export const insertClassEnrollmentSchema = createInsertSchema(classEnrollments).pick({
  classId: true,
  studentId: true,
  enrolledAt: true,
  status: true,
});

export type InsertClassEnrollment = z.infer<typeof insertClassEnrollmentSchema>;
export type ClassEnrollment = typeof classEnrollments.$inferSelect;

// Assignments (created by teachers)
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  classId: integer("class_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
  lessonId: integer("lesson_id"), // Optional lesson association
  quizId: integer("quiz_id"),     // Optional quiz association
  dueDate: timestamp("due_date").notNull(),
  assignedDate: timestamp("assigned_date").notNull().defaultNow(),
  points: integer("points").default(100).notNull(),
  status: text("status").default("active").notNull(), // draft, active, archived
  resources: jsonb("resources"),
  requirements: jsonb("requirements"),
});

export const insertAssignmentSchema = createInsertSchema(assignments).pick({
  title: true,
  description: true,
  instructions: true,
  classId: true,
  teacherId: true,
  lessonId: true,
  quizId: true,
  dueDate: true,
  assignedDate: true,
  points: true,
  status: true,
  resources: true,
  requirements: true,
});

export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;
export type Assignment = typeof assignments.$inferSelect;

// Assignment Submissions
export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  studentId: integer("student_id").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  content: text("content"),
  attachments: jsonb("attachments"),
  status: text("status").default("submitted").notNull(), // draft, submitted, resubmitted, late
  grade: integer("grade"),
  feedback: text("feedback"),
  gradedBy: integer("graded_by"),
  gradedAt: timestamp("graded_at"),
}, (table) => {
  return {
    assignmentStudentUnique: unique("assignment_student_unique").on(table.assignmentId, table.studentId),
  };
});

export const insertAssignmentSubmissionSchema = createInsertSchema(assignmentSubmissions).pick({
  assignmentId: true,
  studentId: true,
  submittedAt: true,
  content: true,
  attachments: true,
  status: true,
  grade: true,
  feedback: true,
  gradedBy: true,
  gradedAt: true,
});

export type InsertAssignmentSubmission = z.infer<typeof insertAssignmentSubmissionSchema>;
export type AssignmentSubmission = typeof assignmentSubmissions.$inferSelect;

// Lesson Plans (for teachers)
export const lessonPlans = pgTable("lesson_plans", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  teacherId: integer("teacher_id").notNull(),
  classId: integer("class_id").notNull(),
  subject: text("subject").notNull(),
  grade: integer("grade").notNull(),
  objectives: jsonb("objectives").notNull(),
  materials: jsonb("materials"),
  procedure: jsonb("procedure").notNull(),
  assessment: jsonb("assessment"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  status: text("status").default("draft").notNull(), // draft, published, archived
  duration: integer("duration").notNull(), // in minutes
  lessonDate: date("lesson_date").notNull(),
});

export const insertLessonPlanSchema = createInsertSchema(lessonPlans).pick({
  title: true,
  description: true,
  teacherId: true,
  classId: true,
  subject: true,
  grade: true,
  objectives: true,
  materials: true,
  procedure: true,
  assessment: true,
  notes: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  duration: true,
  lessonDate: true,
});

export type InsertLessonPlan = z.infer<typeof insertLessonPlanSchema>;
export type LessonPlan = typeof lessonPlans.$inferSelect;

// Performance Analytics (aggregated data)
export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  teacherId: integer("teacher_id").notNull(),
  period: text("period").notNull(), // daily, weekly, monthly, quarterly, yearly
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  metrics: jsonb("metrics").notNull(), // completion rates, average scores, engagement, etc.
  insights: jsonb("insights"), // AI generated insights
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).pick({
  classId: true,
  teacherId: true,
  period: true,
  startDate: true,
  endDate: true,
  metrics: true,
  insights: true,
  createdAt: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

// Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  teacherId: integer("teacher_id").notNull(),
  classId: integer("class_id"), // Optional, if null = school-wide
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  priority: text("priority").default("normal").notNull(), // low, normal, high, urgent
  attachments: jsonb("attachments"),
});

export const insertAnnouncementSchema = createInsertSchema(announcements).pick({
  title: true,
  content: true,
  teacherId: true,
  classId: true,
  createdAt: true,
  expiresAt: true,
  priority: true,
  attachments: true,
});

export type InsertAnnouncement = z.infer<typeof insertAnnouncementSchema>;
export type Announcement = typeof announcements.$inferSelect;

// Visual Programming Projects
export const visualProjects = pgTable("visual_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  blocks: jsonb("blocks").notNull(), // JSON representation of the programming blocks
  assets: jsonb("assets"), // JSON representation of project assets (sprites, backgrounds, etc.)
  isPublic: boolean("is_public").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertVisualProjectSchema = createInsertSchema(visualProjects).pick({
  userId: true,
  title: true,
  description: true,
  thumbnail: true,
  blocks: true,
  assets: true,
  isPublic: true,
});

export type InsertVisualProject = z.infer<typeof insertVisualProjectSchema>;
export type VisualProject = typeof visualProjects.$inferSelect;

// Visual Programming Sprites
export const visualSprites = pgTable("visual_sprites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVisualSpriteSchema = createInsertSchema(visualSprites).pick({
  userId: true,
  name: true,
  imageUrl: true,
  isPublic: true,
  tags: true,
});

export type InsertVisualSprite = z.infer<typeof insertVisualSpriteSchema>;
export type VisualSprite = typeof visualSprites.$inferSelect;

// Visual Programming Backgrounds
export const visualBackgrounds = pgTable("visual_backgrounds", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVisualBackgroundSchema = createInsertSchema(visualBackgrounds).pick({
  userId: true,
  name: true,
  imageUrl: true,
  isPublic: true,
  tags: true,
});

export type InsertVisualBackground = z.infer<typeof insertVisualBackgroundSchema>;
export type VisualBackground = typeof visualBackgrounds.$inferSelect;

// Shared Visual Project Elements
export const sharedVisualElements = pgTable("shared_visual_elements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), 
  type: text("type").notNull(), // 'sprite', 'background', 'sound', 'block'
  content: jsonb("content").notNull(),
  category: text("category").notNull(), // e.g., 'animals', 'vehicles', 'nature', etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSharedVisualElementSchema = createInsertSchema(sharedVisualElements).pick({
  name: true,
  type: true,
  content: true,
  category: true,
});

export type InsertSharedVisualElement = z.infer<typeof insertSharedVisualElementSchema>;
export type SharedVisualElement = typeof sharedVisualElements.$inferSelect;

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  avatarUrl: text("avatar_url"),
  organization: text("organization"),
  featured: boolean("featured").default(false).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertTestimonialSchema = createInsertSchema(testimonials).pick({
  name: true,
  role: true,
  content: true,
  rating: true,
  avatarUrl: true,
  organization: true,
  featured: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

// Statistics
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  value: text("value").notNull(),
  icon: text("icon"),
  category: text("category").notNull(), // e.g., "users", "content", "engagement"
  displayOrder: integer("display_order").default(0).notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertStatisticSchema = createInsertSchema(statistics).pick({
  name: true,
  value: true,
  icon: true,
  category: true,
  displayOrder: true,
});

export type InsertStatistic = z.infer<typeof insertStatisticSchema>;
export type Statistic = typeof statistics.$inferSelect;

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  progress: many(userProgress),
  quizResults: many(quizResults),
  badges: many(userBadges),
  downloads: many(downloadedContent),
  chatMessages: many(chatMessages),
  teacher: one(teachers, {
    fields: [users.id],
    references: [teachers.userId]
  }),
  enrollments: many(classEnrollments, {
    relationName: "student_enrollments"
  }),
  submissions: many(assignmentSubmissions, {
    relationName: "student_submissions"
  })
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  lessons: many(lessons)
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [lessons.subjectId],
    references: [subjects.id]
  }),
  quiz: one(quizzes, {
    fields: [lessons.id],
    references: [quizzes.lessonId]
  }),
  progress: many(userProgress),
  downloads: many(downloadedContent)
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id]
  }),
  results: many(quizResults)
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id]
  }),
  lesson: one(lessons, {
    fields: [userProgress.lessonId],
    references: [lessons.id]
  })
}));

export const quizResultsRelations = relations(quizResults, ({ one }) => ({
  user: one(users, {
    fields: [quizResults.userId],
    references: [users.id]
  }),
  quiz: one(quizzes, {
    fields: [quizResults.quizId],
    references: [quizzes.id]
  })
}));

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges)
}));

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, {
    fields: [userBadges.userId],
    references: [users.id]
  }),
  badge: one(badges, {
    fields: [userBadges.badgeId],
    references: [badges.id]
  })
}));

export const downloadedContentRelations = relations(downloadedContent, ({ one }) => ({
  user: one(users, {
    fields: [downloadedContent.userId],
    references: [users.id]
  }),
  lesson: one(lessons, {
    fields: [downloadedContent.lessonId],
    references: [lessons.id]
  })
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id]
  })
}));

// Teacher relations
export const teachersRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, {
    fields: [teachers.userId],
    references: [users.id]
  }),
  classes: many(classes),
  assignments: many(assignments),
  lessonPlans: many(lessonPlans),
  announcements: many(announcements),
  analytics: many(analytics)
}));

// Class relations
export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id]
  }),
  enrollments: many(classEnrollments),
  assignments: many(assignments),
  lessonPlans: many(lessonPlans),
  announcements: many(announcements),
  analytics: many(analytics)
}));

// Class Enrollment relations
export const classEnrollmentsRelations = relations(classEnrollments, ({ one }) => ({
  class: one(classes, {
    fields: [classEnrollments.classId],
    references: [classes.id]
  }),
  student: one(users, {
    fields: [classEnrollments.studentId],
    references: [users.id],
    relationName: "student_enrollments"
  })
}));

// Assignment relations
export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id]
  }),
  teacher: one(users, {
    fields: [assignments.teacherId],
    references: [users.id]
  }),
  lesson: one(lessons, {
    fields: [assignments.lessonId],
    references: [lessons.id]
  }),
  quiz: one(quizzes, {
    fields: [assignments.quizId],
    references: [quizzes.id]
  }),
  submissions: many(assignmentSubmissions)
}));

// Assignment Submission relations
export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id]
  }),
  student: one(users, {
    fields: [assignmentSubmissions.studentId],
    references: [users.id],
    relationName: "student_submissions"
  }),
  gradedByTeacher: one(users, {
    fields: [assignmentSubmissions.gradedBy],
    references: [users.id]
  })
}));

// Lesson Plan relations
export const lessonPlansRelations = relations(lessonPlans, ({ one }) => ({
  teacher: one(users, {
    fields: [lessonPlans.teacherId],
    references: [users.id]
  }),
  class: one(classes, {
    fields: [lessonPlans.classId],
    references: [classes.id]
  })
}));

// Analytics relations
export const analyticsRelations = relations(analytics, ({ one }) => ({
  class: one(classes, {
    fields: [analytics.classId],
    references: [classes.id]
  }),
  teacher: one(users, {
    fields: [analytics.teacherId],
    references: [users.id]
  })
}));

// Announcement relations
export const announcementsRelations = relations(announcements, ({ one }) => ({
  teacher: one(users, {
    fields: [announcements.teacherId],
    references: [users.id]
  }),
  class: one(classes, {
    fields: [announcements.classId],
    references: [classes.id]
  })
}));

// Visual Project relations
export const visualProjectsRelations = relations(visualProjects, ({ one }) => ({
  user: one(users, {
    fields: [visualProjects.userId],
    references: [users.id]
  })
}));

// Visual Sprite relations
export const visualSpritesRelations = relations(visualSprites, ({ one }) => ({
  user: one(users, {
    fields: [visualSprites.userId],
    references: [users.id]
  })
}));

// Visual Background relations
export const visualBackgroundsRelations = relations(visualBackgrounds, ({ one }) => ({
  user: one(users, {
    fields: [visualBackgrounds.userId],
    references: [users.id]
  })
}));