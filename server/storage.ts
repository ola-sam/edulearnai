import {
  users,
  subjects,
  lessons,
  quizzes,
  userProgress,
  quizResults,
  badges,
  userBadges,
  downloadedContent,
  chatMessages,
  teachers,
  classes,
  classEnrollments,
  assignments,
  assignmentSubmissions,
  lessonPlans,
  analytics,
  announcements,
  testimonials,
  statistics,
  curriculumDocuments,
  visualProjects,
  visualSprites,
  visualBackgrounds,
  sharedVisualElements,
  teachingResources,
  type User,
  type InsertUser,
  type Subject,
  type InsertSubject,
  type Lesson,
  type InsertLesson,
  type Quiz,
  type InsertQuiz,
  type UserProgress,
  type InsertUserProgress,
  type QuizResult,
  type InsertQuizResult,
  type Badge,
  type InsertBadge,
  type UserBadge,
  type InsertUserBadge,
  type DownloadedContent,
  type InsertDownloadedContent,
  type ChatMessage,
  type InsertChatMessage,
  type Teacher,
  type InsertTeacher,
  type Class,
  type InsertClass,
  type ClassEnrollment,
  type InsertClassEnrollment,
  type Assignment,
  type InsertAssignment,
  type AssignmentSubmission,
  type InsertAssignmentSubmission,
  type LessonPlan,
  type InsertLessonPlan,
  type Analytics,
  type InsertAnalytics,
  type Announcement,
  type InsertAnnouncement,
  type Testimonial,
  type InsertTestimonial,
  type Statistic,
  type InsertStatistic,
  type CurriculumDocument,
  type InsertCurriculumDocument,
  type VisualProject,
  type InsertVisualProject,
  type VisualSprite,
  type InsertVisualSprite,
  type VisualBackground,
  type InsertVisualBackground,
  type SharedVisualElement,
  type InsertSharedVisualElement,
  type TeachingResource,
  type InsertTeachingResource
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import createMemoryStore from "memorystore";

const PostgresSessionStore = connectPg(session);
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(id: number, points: number): Promise<User | undefined>;
  
  // Subject operations
  getSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // Lesson operations
  getLessons(): Promise<Lesson[]>;
  getLessonsBySubject(subjectId: number): Promise<Lesson[]>;
  getLessonsByGrade(grade: number): Promise<Lesson[]>;
  getLessonById(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Quiz operations
  getQuizzes(): Promise<Quiz[]>;
  getQuizByLessonId(lessonId: number): Promise<Quiz | undefined>;
  getQuizById(id: number): Promise<Quiz | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // User Progress operations
  getUserProgress(userId: number): Promise<UserProgress[]>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Quiz Results operations
  getQuizResults(userId: number): Promise<QuizResult[]>;
  createQuizResult(result: InsertQuizResult): Promise<QuizResult>;
  
  // Badges operations
  getBadges(): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // User Badges operations
  getUserBadges(userId: number): Promise<UserBadge[]>;
  createUserBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
  
  // Downloaded Content operations
  getDownloadedContent(userId: number): Promise<DownloadedContent[]>;
  createDownloadedContent(content: InsertDownloadedContent): Promise<DownloadedContent>;
  updateDownloadProgress(id: number, progress: number, status: string): Promise<DownloadedContent | undefined>;
  
  // Leaderboard operations
  getLeaderboard(grade?: number): Promise<User[]>;
  
  // Chat Message operations
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Teacher operations
  getTeacherByUserId(userId: number): Promise<Teacher | undefined>;
  createTeacher(teacher: InsertTeacher): Promise<Teacher>;
  
  // Class operations
  getClasses(): Promise<Class[]>;
  getClassesByTeacher(teacherId: number): Promise<Class[]>;
  getClassById(id: number): Promise<Class | undefined>;
  createClass(class_: InsertClass): Promise<Class>;
  updateClass(id: number, class_: Partial<InsertClass>): Promise<Class | undefined>;
  
  // Class enrollment operations
  getClassEnrollments(classId: number): Promise<ClassEnrollment[]>;
  getStudentEnrollments(studentId: number): Promise<ClassEnrollment[]>;
  createClassEnrollment(enrollment: InsertClassEnrollment): Promise<ClassEnrollment>;
  
  // Assignment operations
  getAssignments(): Promise<Assignment[]>;
  getAssignmentsByTeacher(teacherId: number): Promise<Assignment[]>;
  getAssignmentsByClass(classId: number): Promise<Assignment[]>;
  getRecentAssignmentsByTeacher(teacherId: number, limit?: number): Promise<Assignment[]>;
  getAssignmentById(id: number): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  
  // Assignment submission operations
  getAssignmentSubmissions(assignmentId: number): Promise<AssignmentSubmission[]>;
  getStudentSubmissions(studentId: number): Promise<AssignmentSubmission[]>;
  createAssignmentSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission>;
  
  // Lesson plan operations
  getLessonPlans(): Promise<LessonPlan[]>;
  getLessonPlansByTeacher(teacherId: number): Promise<LessonPlan[]>;
  getLessonPlansByClass(classId: number): Promise<LessonPlan[]>;
  getLessonPlanById(id: number): Promise<LessonPlan | undefined>;
  createLessonPlan(lessonPlan: InsertLessonPlan): Promise<LessonPlan>;
  
  // Analytics operations
  getAnalyticsByTeacher(teacherId: number, period?: string): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalyticsSummary(teacherId: number): Promise<{ totalStudents: number, averageScore: number, completionRate: number }>;
  
  // Announcement operations
  getAnnouncements(): Promise<Announcement[]>;
  getAnnouncementsByTeacher(teacherId: number): Promise<Announcement[]>;
  getAnnouncementsByClass(classId: number): Promise<Announcement[]>;
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  
  // Testimonial operations
  getTestimonials(limit?: number): Promise<Testimonial[]>;
  getFeaturedTestimonials(limit?: number): Promise<Testimonial[]>;
  getTestimonialById(id: number): Promise<Testimonial | undefined>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Statistics operations
  getStatistics(): Promise<Statistic[]>;
  getStatisticsByCategory(category: string): Promise<Statistic[]>;
  createStatistic(statistic: InsertStatistic): Promise<Statistic>;
  updateStatistic(id: number, value: string): Promise<Statistic | undefined>;
  
  // Curriculum Document operations (for RAG)
  getCurriculumDocuments(): Promise<CurriculumDocument[]>;
  getCurriculumDocumentById(id: number): Promise<CurriculumDocument | undefined>;
  getCurriculumDocumentsByGrade(grade: number): Promise<CurriculumDocument[]>;
  getCurriculumDocumentsBySubject(subject: string): Promise<CurriculumDocument[]>;
  getCurriculumDocumentsByGradeAndSubject(grade: number, subject: string): Promise<CurriculumDocument[]>;
  createCurriculumDocument(document: InsertCurriculumDocument): Promise<CurriculumDocument>;
  updateCurriculumDocumentEmbedding(id: number, embedding: string): Promise<CurriculumDocument | undefined>;
  searchSimilarDocuments(embedding: number[], limit?: number): Promise<CurriculumDocument[]>;
  
  // Visual Programming Project operations
  getVisualProjects(userId?: number): Promise<VisualProject[]>;
  getVisualProjectById(id: number): Promise<VisualProject | undefined>;
  getPublicVisualProjects(limit?: number): Promise<VisualProject[]>;
  createVisualProject(project: InsertVisualProject): Promise<VisualProject>;
  updateVisualProject(id: number, project: Partial<InsertVisualProject>): Promise<VisualProject | undefined>;
  deleteVisualProject(id: number): Promise<boolean>;
  
  // Visual Sprite operations
  getVisualSprites(userId?: number): Promise<VisualSprite[]>;
  getVisualSpriteById(id: number): Promise<VisualSprite | undefined>;
  getPublicVisualSprites(): Promise<VisualSprite[]>;
  createVisualSprite(sprite: InsertVisualSprite): Promise<VisualSprite>;
  deleteVisualSprite(id: number): Promise<boolean>;
  
  // Visual Background operations
  getVisualBackgrounds(userId?: number): Promise<VisualBackground[]>;
  getVisualBackgroundById(id: number): Promise<VisualBackground | undefined>;
  getPublicVisualBackgrounds(): Promise<VisualBackground[]>;
  createVisualBackground(background: InsertVisualBackground): Promise<VisualBackground>;
  deleteVisualBackground(id: number): Promise<boolean>;
  
  // Shared Visual Element operations
  getSharedVisualElements(): Promise<SharedVisualElement[]>;
  getSharedVisualElementsByCategory(category: string): Promise<SharedVisualElement[]>;
  getSharedVisualElementsByType(type: string): Promise<SharedVisualElement[]>;
  createSharedVisualElement(element: InsertSharedVisualElement): Promise<SharedVisualElement>;
  
  // Teaching Resource operations
  getTeachingResources(): Promise<TeachingResource[]>;
  getTeachingResourceById(id: number): Promise<TeachingResource | undefined>;
  getTeachingResourcesByTeacher(teacherId: number): Promise<TeachingResource[]>;
  getTeachingResourcesByClass(classId: number): Promise<TeachingResource[]>;
  getTeachingResourcesByType(resourceType: string): Promise<TeachingResource[]>;
  createTeachingResource(resource: InsertTeachingResource): Promise<TeachingResource>;
  updateTeachingResource(id: number, resource: Partial<InsertTeachingResource>): Promise<TeachingResource | undefined>;
  deleteTeachingResource(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private lessons: Map<number, Lesson>;
  private quizzes: Map<number, Quiz>;
  private userProgress: Map<number, UserProgress>;
  private quizResults: Map<number, QuizResult>;
  private badges: Map<number, Badge>;
  private userBadges: Map<number, UserBadge>;
  private downloadedContent: Map<number, DownloadedContent>;
  private chatMessages: Map<number, ChatMessage>;
  
  sessionStore: session.Store;
  
  private currentUserId: number;
  private currentSubjectId: number;
  private currentLessonId: number;
  private currentQuizId: number;
  private currentProgressId: number;
  private currentResultId: number;
  private currentBadgeId: number;
  private currentUserBadgeId: number;
  private currentDownloadId: number;
  private currentChatMessageId: number;

  constructor() {
    // Create memory session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    this.users = new Map();
    this.subjects = new Map();
    this.lessons = new Map();
    this.quizzes = new Map();
    this.userProgress = new Map();
    this.quizResults = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.downloadedContent = new Map();
    this.chatMessages = new Map();
    
    this.currentUserId = 1;
    this.currentSubjectId = 1;
    this.currentLessonId = 1;
    this.currentQuizId = 1;
    this.currentProgressId = 1;
    this.currentResultId = 1;
    this.currentBadgeId = 1;
    this.currentUserBadgeId = 1;
    this.currentDownloadId = 1;
    this.currentChatMessageId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  // Initialize the storage with sample data
  private initializeSampleData() {
    // Create subjects
    const mathSubject: InsertSubject = {
      name: "Mathematics",
      icon: "calculate",
      color: "#3B82F6" // Primary blue
    };
    const englishSubject: InsertSubject = {
      name: "English",
      icon: "menu_book",
      color: "#F59E0B" // Warning yellow
    };
    const scienceSubject: InsertSubject = {
      name: "Science",
      icon: "science",
      color: "#10B981" // Success green
    };
    
    this.createSubject(mathSubject);
    this.createSubject(englishSubject);
    this.createSubject(scienceSubject);
    
    // Create sample lessons
    this.createLesson({
      title: "Multiplication Tables",
      description: "Practice your multiplication skills with interactive tables and quizzes.",
      content: "Content for multiplication tables lesson",
      subjectId: 1, // Math
      grade: 5,
      duration: 15,
      difficulty: 3,
      downloadSize: 12000, // 12MB
      downloadUrl: "/lessons/math/multiplication-tables"
    });
    
    this.createLesson({
      title: "Verb Tenses",
      description: "Learn about past, present, and future tenses with fun examples.",
      content: "Content for verb tenses lesson",
      subjectId: 2, // English
      grade: 5,
      duration: 20,
      difficulty: 4,
      downloadSize: 8000, // 8MB
      downloadUrl: "/lessons/english/verb-tenses"
    });
    
    this.createLesson({
      title: "Animal Habitats",
      description: "Explore different animal habitats and how they adapt to their environments.",
      content: "Content for animal habitats lesson",
      subjectId: 3, // Science
      grade: 5,
      duration: 25,
      difficulty: 5,
      downloadSize: 18000, // 18MB
      downloadUrl: "/lessons/science/animal-habitats"
    });
    
    // Create sample badges
    this.createBadge({
      name: "Math Master",
      description: "Earned by completing 5 math lessons with perfect quiz scores",
      icon: "emoji_events",
      color: "#3B82F6",
      criteria: { subject: "Mathematics", lessonCount: 5, minScore: 100 }
    });
    
    this.createBadge({
      name: "Reading Pro",
      description: "Earned by reading 10 English lessons",
      icon: "auto_stories",
      color: "#F59E0B",
      criteria: { subject: "English", lessonCount: 10 }
    });
    
    this.createBadge({
      name: "Science Explorer",
      description: "Earned by completing all Science lessons in your grade",
      icon: "science",
      color: "#10B981",
      criteria: { subject: "Science", completeAll: true }
    });
    
    this.createBadge({
      name: "Perfect Score",
      description: "Earn perfect scores on 3 consecutive quizzes",
      icon: "military_tech",
      color: "#6366F1",
      criteria: { perfectScoreStreak: 3 }
    });
    
    // Create demo user
    this.createUser({
      username: "jamie.smith",
      password: "password123",
      firstName: "Jamie",
      lastName: "Smith", 
      grade: 5
    });
    
    // Create user progress and download status for sample data
    const now = new Date();
    
    // User progress for math
    this.createOrUpdateUserProgress({
      userId: 1,
      lessonId: 1,
      completed: true,
      timeSpent: 900, // 15 minutes
      lastAccessed: now
    });
    
    // User progress for english
    this.createOrUpdateUserProgress({
      userId: 1,
      lessonId: 2,
      completed: false,
      timeSpent: 500, // About 8 minutes
      lastAccessed: now
    });
    
    // User progress for science
    this.createOrUpdateUserProgress({
      userId: 1, 
      lessonId: 3,
      completed: false,
      timeSpent: 300, // 5 minutes
      lastAccessed: now
    });
    
    // Set up downloaded content
    this.createDownloadedContent({
      userId: 1,
      lessonId: 1, 
      downloadedAt: now,
      status: "completed",
      progress: 100
    });
    
    this.createDownloadedContent({
      userId: 1,
      lessonId: 2,
      downloadedAt: now,
      status: "completed", 
      progress: 100
    });
    
    this.createDownloadedContent({
      userId: 1,
      lessonId: 3,
      downloadedAt: now,
      status: "in_progress",
      progress: 65
    });
    
    // Add earned badges
    this.createUserBadge({
      userId: 1,
      badgeId: 1, // Math Master
      dateEarned: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
    });
    
    this.createUserBadge({
      userId: 1,
      badgeId: 2, // Reading Pro
      dateEarned: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
    });
    
    this.createUserBadge({
      userId: 1,
      badgeId: 3, // Science Explorer
      dateEarned: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 2 weeks ago
    });
    
    // Add some points to the user
    this.updateUserPoints(1, 250);
    
    // Add dummy users for leaderboard
    this.createUser({
      username: "alex.wilson",
      password: "password123",
      firstName: "Alex",
      lastName: "Wilson",
      grade: 5
    });
    
    this.updateUserPoints(2, 225);
    
    this.createUser({
      username: "taylor.brown",
      password: "password123",
      firstName: "Taylor",
      lastName: "Brown",
      grade: 5
    });
    
    this.updateUserPoints(3, 190);
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id, 
      points: 0, 
      avatarUrl: null,
      role: insertUser.role || 'student',
      isTeacher: insertUser.isTeacher || false
    };
    this.users.set(id, user);
    return user;
  }
  
  async updateUserPoints(id: number, points: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      points
    };
    
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }
  
  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.currentSubjectId++;
    const subject: Subject = { 
      ...insertSubject, 
      id,
      color: insertSubject.color || "#3B82F6" // Default color if not provided
    };
    this.subjects.set(id, subject);
    return subject;
  }
  
  // Lesson operations
  async getLessons(): Promise<Lesson[]> {
    return Array.from(this.lessons.values());
  }
  
  async getLessonsBySubject(subjectId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(
      (lesson) => lesson.subjectId === subjectId
    );
  }
  
  async getLessonsByGrade(grade: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values()).filter(
      (lesson) => lesson.grade === grade
    );
  }
  
  async getLessonById(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }
  
  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const id = this.currentLessonId++;
    const lesson: Lesson = { 
      ...insertLesson, 
      id,
      downloadSize: insertLesson.downloadSize !== undefined ? insertLesson.downloadSize : null,
      downloadUrl: insertLesson.downloadUrl !== undefined ? insertLesson.downloadUrl : null
    };
    this.lessons.set(id, lesson);
    return lesson;
  }
  
  // Quiz operations
  async getQuizzes(): Promise<Quiz[]> {
    return Array.from(this.quizzes.values());
  }
  
  async getQuizByLessonId(lessonId: number): Promise<Quiz | undefined> {
    return Array.from(this.quizzes.values()).find(
      (quiz) => quiz.lessonId === lessonId
    );
  }
  
  async getQuizById(id: number): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }
  
  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = this.currentQuizId++;
    const quiz: Quiz = { ...insertQuiz, id };
    this.quizzes.set(id, quiz);
    return quiz;
  }
  
  // User Progress operations
  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }
  
  async createOrUpdateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress already exists for this user and lesson
    const existingProgress = Array.from(this.userProgress.values()).find(
      (p) => p.userId === insertProgress.userId && p.lessonId === insertProgress.lessonId
    );
    
    if (existingProgress) {
      const updatedProgress: UserProgress = {
        ...existingProgress,
        completed: insertProgress.completed !== undefined ? insertProgress.completed : existingProgress.completed,
        timeSpent: insertProgress.timeSpent !== undefined ? insertProgress.timeSpent : existingProgress.timeSpent,
        lastAccessed: insertProgress.lastAccessed
      };
      this.userProgress.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentProgressId++;
      const progress: UserProgress = { 
        ...insertProgress, 
        id,
        completed: insertProgress.completed !== undefined ? insertProgress.completed : false,
        timeSpent: insertProgress.timeSpent !== undefined ? insertProgress.timeSpent : 0
      };
      this.userProgress.set(id, progress);
      return progress;
    }
  }
  
  // Quiz Results operations
  async getQuizResults(userId: number): Promise<QuizResult[]> {
    return Array.from(this.quizResults.values()).filter(
      (result) => result.userId === userId
    );
  }
  
  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const id = this.currentResultId++;
    const result: QuizResult = { ...insertResult, id };
    this.quizResults.set(id, result);
    return result;
  }
  
  // Badges operations
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const id = this.currentBadgeId++;
    const badge: Badge = { ...insertBadge, id };
    this.badges.set(id, badge);
    return badge;
  }
  
  // User Badges operations
  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values()).filter(
      (badge) => badge.userId === userId
    );
  }
  
  async createUserBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const id = this.currentUserBadgeId++;
    const userBadge: UserBadge = { ...insertUserBadge, id };
    this.userBadges.set(id, userBadge);
    return userBadge;
  }
  
  // Downloaded Content operations
  async getDownloadedContent(userId: number): Promise<DownloadedContent[]> {
    return Array.from(this.downloadedContent.values()).filter(
      (content) => content.userId === userId
    );
  }
  
  async createDownloadedContent(insertContent: InsertDownloadedContent): Promise<DownloadedContent> {
    const id = this.currentDownloadId++;
    const content: DownloadedContent = { 
      ...insertContent, 
      id,
      progress: insertContent.progress !== undefined ? insertContent.progress : 0 
    };
    this.downloadedContent.set(id, content);
    return content;
  }
  
  async updateDownloadProgress(id: number, progress: number, status: string): Promise<DownloadedContent | undefined> {
    const content = this.downloadedContent.get(id);
    if (!content) return undefined;
    
    const updatedContent: DownloadedContent = {
      ...content,
      progress,
      status
    };
    
    this.downloadedContent.set(id, updatedContent);
    return updatedContent;
  }
  
  // Leaderboard operations
  async getLeaderboard(grade?: number): Promise<User[]> {
    let users = Array.from(this.users.values());
    
    // Filter by grade if specified
    if (grade !== undefined) {
      users = users.filter(user => user.grade === grade);
    }
    
    // Sort by points in descending order
    return users.sort((a, b) => b.points - a.points);
  }
  
  // Chat Message operations
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    const messages = Array.from(this.chatMessages.values())
      .filter(message => message.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? messages.slice(0, limit) : messages;
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentChatMessageId++;
    // Ensure timestamp and subject are properly set
    const message: ChatMessage = { 
      ...insertMessage, 
      id,
      timestamp: insertMessage.timestamp || new Date(),
      subject: insertMessage.subject || null
    };
    this.chatMessages.set(id, message);
    return message;
  }
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      tableName: 'sessions',
      createTableIfMissing: true 
    });
  }
  
  // Visual Programming Project operations
  async getVisualProjects(userId?: number): Promise<VisualProject[]> {
    if (userId) {
      return await db.select().from(visualProjects).where(eq(visualProjects.userId, userId));
    }
    return await db.select().from(visualProjects);
  }
  
  async getVisualProjectById(id: number): Promise<VisualProject | undefined> {
    const [project] = await db.select().from(visualProjects).where(eq(visualProjects.id, id));
    return project || undefined;
  }
  
  async getPublicVisualProjects(limit?: number): Promise<VisualProject[]> {
    let query = db.select().from(visualProjects).where(eq(visualProjects.isPublic, true));
    if (limit) {
      query = query.limit(limit);
    }
    return await query;
  }
  
  async createVisualProject(project: InsertVisualProject): Promise<VisualProject> {
    const [newProject] = await db.insert(visualProjects).values(project).returning();
    return newProject;
  }
  
  async updateVisualProject(id: number, project: Partial<InsertVisualProject>): Promise<VisualProject | undefined> {
    const [updatedProject] = await db.update(visualProjects)
      .set(project)
      .where(eq(visualProjects.id, id))
      .returning();
    return updatedProject || undefined;
  }
  
  async deleteVisualProject(id: number): Promise<boolean> {
    const [deleted] = await db.delete(visualProjects)
      .where(eq(visualProjects.id, id))
      .returning({ id: visualProjects.id });
    return !!deleted;
  }
  
  // Visual Sprite operations
  async getVisualSprites(userId?: number): Promise<VisualSprite[]> {
    if (userId) {
      return await db.select().from(visualSprites).where(eq(visualSprites.userId, userId));
    }
    return await db.select().from(visualSprites);
  }
  
  async getVisualSpriteById(id: number): Promise<VisualSprite | undefined> {
    const [sprite] = await db.select().from(visualSprites).where(eq(visualSprites.id, id));
    return sprite || undefined;
  }
  
  async getPublicVisualSprites(): Promise<VisualSprite[]> {
    return await db.select().from(visualSprites).where(eq(visualSprites.isPublic, true));
  }
  
  async createVisualSprite(sprite: InsertVisualSprite): Promise<VisualSprite> {
    const [newSprite] = await db.insert(visualSprites).values(sprite).returning();
    return newSprite;
  }
  
  async deleteVisualSprite(id: number): Promise<boolean> {
    const [deleted] = await db.delete(visualSprites)
      .where(eq(visualSprites.id, id))
      .returning({ id: visualSprites.id });
    return !!deleted;
  }
  
  // Visual Background operations
  async getVisualBackgrounds(userId?: number): Promise<VisualBackground[]> {
    if (userId) {
      return await db.select().from(visualBackgrounds).where(eq(visualBackgrounds.userId, userId));
    }
    return await db.select().from(visualBackgrounds);
  }
  
  async getVisualBackgroundById(id: number): Promise<VisualBackground | undefined> {
    const [background] = await db.select().from(visualBackgrounds).where(eq(visualBackgrounds.id, id));
    return background || undefined;
  }
  
  async getPublicVisualBackgrounds(): Promise<VisualBackground[]> {
    return await db.select().from(visualBackgrounds).where(eq(visualBackgrounds.isPublic, true));
  }
  
  async createVisualBackground(background: InsertVisualBackground): Promise<VisualBackground> {
    const [newBackground] = await db.insert(visualBackgrounds).values(background).returning();
    return newBackground;
  }
  
  async deleteVisualBackground(id: number): Promise<boolean> {
    const [deleted] = await db.delete(visualBackgrounds)
      .where(eq(visualBackgrounds.id, id))
      .returning({ id: visualBackgrounds.id });
    return !!deleted;
  }
  
  // Shared Visual Element operations
  async getSharedVisualElements(): Promise<SharedVisualElement[]> {
    return await db.select().from(sharedVisualElements);
  }
  
  async getSharedVisualElementsByCategory(category: string): Promise<SharedVisualElement[]> {
    return await db.select().from(sharedVisualElements).where(eq(sharedVisualElements.category, category));
  }
  
  async getSharedVisualElementsByType(type: string): Promise<SharedVisualElement[]> {
    return await db.select().from(sharedVisualElements).where(eq(sharedVisualElements.type, type));
  }
  
  async createSharedVisualElement(element: InsertSharedVisualElement): Promise<SharedVisualElement> {
    const [newElement] = await db.insert(sharedVisualElements).values(element).returning();
    return newElement;
  }
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPoints(id: number, points: number): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;

    const newPoints = existingUser.points + points;
    const [updatedUser] = await db
      .update(users)
      .set({ points: newPoints })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  async getSubjects(): Promise<Subject[]> {
    return db.select().from(subjects);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const [subject] = await db
      .insert(subjects)
      .values(insertSubject)
      .returning();
    return subject;
  }

  async getLessons(): Promise<Lesson[]> {
    return db.select().from(lessons);
  }

  async getLessonsBySubject(subjectId: number): Promise<Lesson[]> {
    return db
      .select()
      .from(lessons)
      .where(eq(lessons.subjectId, subjectId));
  }

  async getLessonsByGrade(grade: number): Promise<Lesson[]> {
    return db
      .select()
      .from(lessons)
      .where(eq(lessons.grade, grade));
  }

  async getLessonById(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db
      .insert(lessons)
      .values(insertLesson)
      .returning();
    return lesson;
  }

  async getQuizzes(): Promise<Quiz[]> {
    return db.select().from(quizzes);
  }

  async getQuizByLessonId(lessonId: number): Promise<Quiz | undefined> {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId));
    return quiz || undefined;
  }

  async getQuizById(id: number): Promise<Quiz | undefined> {
    const [quiz] = await db.select().from(quizzes).where(eq(quizzes.id, id));
    return quiz || undefined;
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db
      .insert(quizzes)
      .values(insertQuiz)
      .returning();
    return quiz;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));
  }

  async createOrUpdateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Check if progress entry already exists
    const [existingProgress] = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, insertProgress.userId),
          eq(userProgress.lessonId, insertProgress.lessonId)
        )
      );

    if (existingProgress) {
      // Update existing progress
      const [updatedProgress] = await db
        .update(userProgress)
        .set(insertProgress)
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      // Create new progress
      const [progress] = await db
        .insert(userProgress)
        .values(insertProgress)
        .returning();
      return progress;
    }
  }

  async getQuizResults(userId: number): Promise<QuizResult[]> {
    return db
      .select()
      .from(quizResults)
      .where(eq(quizResults.userId, userId));
  }

  async createQuizResult(insertResult: InsertQuizResult): Promise<QuizResult> {
    const [result] = await db
      .insert(quizResults)
      .values(insertResult)
      .returning();
    return result;
  }

  async getBadges(): Promise<Badge[]> {
    return db.select().from(badges);
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db
      .insert(badges)
      .values(insertBadge)
      .returning();
    return badge;
  }

  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return db
      .select()
      .from(userBadges)
      .where(eq(userBadges.userId, userId));
  }

  async createUserBadge(insertUserBadge: InsertUserBadge): Promise<UserBadge> {
    const [userBadge] = await db
      .insert(userBadges)
      .values(insertUserBadge)
      .returning();
    return userBadge;
  }

  async getDownloadedContent(userId: number): Promise<DownloadedContent[]> {
    return db
      .select()
      .from(downloadedContent)
      .where(eq(downloadedContent.userId, userId));
  }

  async createDownloadedContent(insertContent: InsertDownloadedContent): Promise<DownloadedContent> {
    const [content] = await db
      .insert(downloadedContent)
      .values(insertContent)
      .returning();
    return content;
  }

  async updateDownloadProgress(id: number, progress: number, status: string): Promise<DownloadedContent | undefined> {
    const [updatedContent] = await db
      .update(downloadedContent)
      .set({ progress, status })
      .where(eq(downloadedContent.id, id))
      .returning();
    
    return updatedContent || undefined;
  }

  async getLeaderboard(grade?: number): Promise<User[]> {
    // If grade is specified, filter by grade
    if (grade !== undefined) {
      return db
        .select()
        .from(users)
        .where(eq(users.grade, grade))
        .orderBy(desc(users.points))
        .limit(20);
    }
    
    // Otherwise return all users
    return db
      .select()
      .from(users)
      .orderBy(desc(users.points))
      .limit(20);
  }
  
  // Chat Message operations
  async getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]> {
    // Use a simpler query structure that doesn't rely on method chaining with .limit()
    let query = db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.timestamp));
      
    if (limit) {
      return db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.userId, userId))
        .orderBy(desc(chatMessages.timestamp))
        .limit(limit);
    }
    
    return query;
  }
  
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    // Ensure timestamp and subject are properly set before insertion
    const message = {
      ...insertMessage,
      timestamp: insertMessage.timestamp || new Date(),
      subject: insertMessage.subject || null
    };
    
    const [createdMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
    return createdMessage;
  }

  // Teacher operations
  async getTeacherByUserId(userId: number): Promise<Teacher | undefined> {
    const [teacher] = await db.select().from(teachers).where(eq(teachers.userId, userId));
    return teacher || undefined;
  }

  async createTeacher(teacher: InsertTeacher): Promise<Teacher> {
    const [createdTeacher] = await db
      .insert(teachers)
      .values(teacher)
      .returning();
    return createdTeacher;
  }
  
  // Class operations
  async getClasses(): Promise<Class[]> {
    return db.select().from(classes);
  }

  async getClassesByTeacher(teacherId: number): Promise<Class[]> {
    return db.select().from(classes).where(eq(classes.teacherId, teacherId));
  }

  async getClassById(id: number): Promise<Class | undefined> {
    const [class_] = await db.select().from(classes).where(eq(classes.id, id));
    return class_ || undefined;
  }

  async createClass(class_: InsertClass): Promise<Class> {
    const [createdClass] = await db
      .insert(classes)
      .values(class_)
      .returning();
    return createdClass;
  }

  async updateClass(id: number, class_: Partial<InsertClass>): Promise<Class | undefined> {
    const [updatedClass] = await db
      .update(classes)
      .set(class_)
      .where(eq(classes.id, id))
      .returning();
    return updatedClass || undefined;
  }
  
  // Class enrollment operations
  async getClassEnrollments(classId: number): Promise<ClassEnrollment[]> {
    return db.select().from(classEnrollments).where(eq(classEnrollments.classId, classId));
  }

  async getStudentEnrollments(studentId: number): Promise<ClassEnrollment[]> {
    return db.select().from(classEnrollments).where(eq(classEnrollments.studentId, studentId));
  }

  async createClassEnrollment(enrollment: InsertClassEnrollment): Promise<ClassEnrollment> {
    const [createdEnrollment] = await db
      .insert(classEnrollments)
      .values(enrollment)
      .returning();
    return createdEnrollment;
  }
  
  // Assignment operations
  async getAssignments(): Promise<Assignment[]> {
    return db.select().from(assignments);
  }

  async getAssignmentsByTeacher(teacherId: number): Promise<Assignment[]> {
    return db.select().from(assignments).where(eq(assignments.teacherId, teacherId));
  }

  async getAssignmentsByClass(classId: number): Promise<Assignment[]> {
    return db.select().from(assignments).where(eq(assignments.classId, classId));
  }

  async getRecentAssignmentsByTeacher(teacherId: number, limit: number = 5): Promise<Assignment[]> {
    return db
      .select()
      .from(assignments)
      .where(eq(assignments.teacherId, teacherId))
      .orderBy(desc(assignments.assignedDate))
      .limit(limit);
  }

  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment || undefined;
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const [createdAssignment] = await db
      .insert(assignments)
      .values(assignment)
      .returning();
    return createdAssignment;
  }

  async updateAssignment(id: number, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const [updatedAssignment] = await db
      .update(assignments)
      .set(assignment)
      .where(eq(assignments.id, id))
      .returning();
    return updatedAssignment || undefined;
  }
  
  // Assignment submission operations
  async getAssignmentSubmissions(assignmentId: number): Promise<AssignmentSubmission[]> {
    return db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.assignmentId, assignmentId));
  }

  async getStudentSubmissions(studentId: number): Promise<AssignmentSubmission[]> {
    return db.select().from(assignmentSubmissions).where(eq(assignmentSubmissions.studentId, studentId));
  }

  async createAssignmentSubmission(submission: InsertAssignmentSubmission): Promise<AssignmentSubmission> {
    const [createdSubmission] = await db
      .insert(assignmentSubmissions)
      .values(submission)
      .returning();
    return createdSubmission;
  }
  
  // Lesson plan operations
  async getLessonPlans(): Promise<LessonPlan[]> {
    return db.select().from(lessonPlans);
  }

  async getLessonPlansByTeacher(teacherId: number): Promise<LessonPlan[]> {
    return db.select().from(lessonPlans).where(eq(lessonPlans.teacherId, teacherId));
  }

  async getLessonPlansByClass(classId: number): Promise<LessonPlan[]> {
    return db.select().from(lessonPlans).where(eq(lessonPlans.classId, classId));
  }

  async getLessonPlanById(id: number): Promise<LessonPlan | undefined> {
    const [lessonPlan] = await db.select().from(lessonPlans).where(eq(lessonPlans.id, id));
    return lessonPlan || undefined;
  }

  async createLessonPlan(lessonPlan: InsertLessonPlan): Promise<LessonPlan> {
    const [createdLessonPlan] = await db
      .insert(lessonPlans)
      .values(lessonPlan)
      .returning();
    return createdLessonPlan;
  }
  
  // Analytics operations
  async getAnalyticsByTeacher(teacherId: number, period?: string): Promise<Analytics[]> {
    let query = db.select().from(analytics).where(eq(analytics.teacherId, teacherId));
    
    if (period) {
      query = query.where(eq(analytics.period, period));
    }
    
    return query;
  }

  async createAnalytics(analytics_: InsertAnalytics): Promise<Analytics> {
    const [createdAnalytics] = await db
      .insert(analytics)
      .values(analytics_)
      .returning();
    return createdAnalytics;
  }

  async getAnalyticsSummary(teacherId: number): Promise<{ totalStudents: number, averageScore: number, completionRate: number }> {
    try {
      // Get all classes for this teacher
      const teacherClasses = await this.getClassesByTeacher(teacherId);
      
      // Get all class IDs
      const classIds = teacherClasses.map(cls => cls.id);
      
      // Initialize variables to track total students
      let totalUniqueStudents = 0;
      
      // Only continue if there are classes
      if (classIds.length > 0) {
        // Get all enrollments for these classes
        const allEnrollments: ClassEnrollment[] = [];
        for (const classId of classIds) {
          const enrollments = await this.getClassEnrollments(classId);
          allEnrollments.push(...enrollments);
        }
        
        // Create a set to track unique student IDs
        const uniqueStudentIds = new Set<number>();
        
        // Add each student ID to the set
        allEnrollments.forEach(enrollment => {
          uniqueStudentIds.add(enrollment.studentId);
        });
        
        // Count unique students
        totalUniqueStudents = uniqueStudentIds.size;
      }
      
      // For now, keep using static values for other metrics
      // In a full implementation, we would compute these from database records
      return {
        totalStudents: totalUniqueStudents,
        averageScore: 85.5,
        completionRate: 78.3
      };
    } catch (error) {
      console.error("Error calculating analytics summary:", error);
      // Fall back to default values if there's an error
      return {
        totalStudents: 0,
        averageScore: 0,
        completionRate: 0
      };
    }
  }
  
  // Announcement operations
  async getAnnouncements(): Promise<Announcement[]> {
    return db.select().from(announcements);
  }

  async getAnnouncementsByTeacher(teacherId: number): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.teacherId, teacherId));
  }

  async getAnnouncementsByClass(classId: number): Promise<Announcement[]> {
    return db.select().from(announcements).where(eq(announcements.classId, classId));
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [createdAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return createdAnnouncement;
  }

  // Testimonial operations
  async getTestimonials(limit?: number): Promise<Testimonial[]> {
    if (limit) {
      return await db
        .select()
        .from(testimonials)
        .orderBy(desc(testimonials.createdAt))
        .limit(limit);
    }
    
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }
  
  async getFeaturedTestimonials(limit?: number): Promise<Testimonial[]> {
    if (limit) {
      return await db
        .select()
        .from(testimonials)
        .where(eq(testimonials.featured, true))
        .orderBy(desc(testimonials.createdAt))
        .limit(limit);
    }
    
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.featured, true))
      .orderBy(desc(testimonials.createdAt));
  }
  
  async getTestimonialById(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, id));
    
    return testimonial || undefined;
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [createdTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    
    return createdTestimonial;
  }
  
  // Statistics operations
  async getStatistics(): Promise<Statistic[]> {
    return await db
      .select()
      .from(statistics)
      .orderBy(statistics.displayOrder);
  }
  
  async getStatisticsByCategory(category: string): Promise<Statistic[]> {
    return await db
      .select()
      .from(statistics)
      .where(eq(statistics.category, category))
      .orderBy(statistics.displayOrder);
  }
  
  async createStatistic(statistic: InsertStatistic): Promise<Statistic> {
    const [createdStatistic] = await db
      .insert(statistics)
      .values(statistic)
      .returning();
    
    return createdStatistic;
  }
  
  async updateStatistic(id: number, value: string): Promise<Statistic | undefined> {
    const [updatedStatistic] = await db
      .update(statistics)
      .set({ 
        value,
        updatedAt: new Date()
      })
      .where(eq(statistics.id, id))
      .returning();
    
    return updatedStatistic || undefined;
  }
  
  // Curriculum Document operations
  async getCurriculumDocuments(): Promise<CurriculumDocument[]> {
    return db.select().from(curriculumDocuments);
  }
  
  async getCurriculumDocumentById(id: number): Promise<CurriculumDocument | undefined> {
    const [document] = await db.select().from(curriculumDocuments).where(eq(curriculumDocuments.id, id));
    return document;
  }
  
  async getCurriculumDocumentsByGrade(grade: number): Promise<CurriculumDocument[]> {
    return db.select().from(curriculumDocuments).where(eq(curriculumDocuments.grade, grade));
  }
  
  async getCurriculumDocumentsBySubject(subject: string): Promise<CurriculumDocument[]> {
    return db.select().from(curriculumDocuments).where(eq(curriculumDocuments.subject, subject));
  }
  
  async getCurriculumDocumentsByGradeAndSubject(grade: number, subject: string): Promise<CurriculumDocument[]> {
    return db.select().from(curriculumDocuments).where(
      and(
        eq(curriculumDocuments.grade, grade),
        eq(curriculumDocuments.subject, subject)
      )
    );
  }
  
  async createCurriculumDocument(document: InsertCurriculumDocument): Promise<CurriculumDocument> {
    const [newDocument] = await db
      .insert(curriculumDocuments)
      .values(document)
      .returning();
    return newDocument;
  }
  
  async updateCurriculumDocumentEmbedding(id: number, embedding: string): Promise<CurriculumDocument | undefined> {
    const [updatedDocument] = await db
      .update(curriculumDocuments)
      .set({ 
        vectorEmbedding: embedding,
        updatedAt: new Date()
      })
      .where(eq(curriculumDocuments.id, id))
      .returning();
      
    return updatedDocument;
  }
  
  // This is a simple cosine similarity search
  // In a production environment, you would use a vector database like pgvector
  // Teaching Resource operations
  async getTeachingResources(): Promise<TeachingResource[]> {
    return await db.select().from(teachingResources);
  }
  
  async getTeachingResourceById(id: number): Promise<TeachingResource | undefined> {
    const results = await db.select().from(teachingResources).where(eq(teachingResources.id, id)).limit(1);
    return results[0];
  }
  
  async getTeachingResourcesByTeacher(teacherId: number): Promise<TeachingResource[]> {
    return await db.select().from(teachingResources).where(eq(teachingResources.teacherId, teacherId));
  }
  
  async getTeachingResourcesByClass(classId: number): Promise<TeachingResource[]> {
    return await db.select().from(teachingResources).where(eq(teachingResources.classId, classId));
  }
  
  async getTeachingResourcesByType(resourceType: string): Promise<TeachingResource[]> {
    return await db.select().from(teachingResources).where(eq(teachingResources.resourceType, resourceType));
  }
  
  async createTeachingResource(resource: InsertTeachingResource): Promise<TeachingResource> {
    const result = await db.insert(teachingResources).values(resource).returning();
    return result[0];
  }
  
  async updateTeachingResource(id: number, resource: Partial<InsertTeachingResource>): Promise<TeachingResource | undefined> {
    const result = await db.update(teachingResources).set(resource).where(eq(teachingResources.id, id)).returning();
    return result[0];
  }
  
  async deleteTeachingResource(id: number): Promise<boolean> {
    const result = await db.delete(teachingResources).where(eq(teachingResources.id, id)).returning();
    return result.length > 0;
  }
  
  async searchSimilarDocuments(embedding: number[], limit: number = 5): Promise<CurriculumDocument[]> {
    // Since we don't have native vector support, we'll fetch all documents and compute similarity in JS
    // (This is not efficient for large datasets - in production use pgvector or a dedicated vector DB)
    const documents = await this.getCurriculumDocuments();
    
    // Filter out documents without embeddings
    const documentsWithEmbeddings = documents.filter(doc => doc.vectorEmbedding);
    
    // Calculate cosine similarity
    const documentsWithSimilarity = documentsWithEmbeddings.map(doc => {
      const docEmbedding = JSON.parse(doc.vectorEmbedding || '[]');
      const similarity = this.calculateCosineSimilarity(embedding, docEmbedding);
      return { ...doc, similarity };
    });
    
    // Sort by similarity (highest first) and return top results
    return documentsWithSimilarity
      .sort((a, b) => (b.similarity || 0) - (a.similarity || 0))
      .slice(0, limit)
      .map(({ similarity, ...doc }) => doc); // Remove similarity from return object
  }
  
  // Helper: Calculate cosine similarity between two vectors
  private calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (normA * normB);
  }
}

// Use the database storage implementation
export const storage = new DatabaseStorage();
