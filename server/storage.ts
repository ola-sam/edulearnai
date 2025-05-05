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
  type InsertDownloadedContent
} from "@shared/schema";

export interface IStorage {
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
  getLeaderboard(): Promise<User[]>;
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
  
  private currentUserId: number;
  private currentSubjectId: number;
  private currentLessonId: number;
  private currentQuizId: number;
  private currentProgressId: number;
  private currentResultId: number;
  private currentBadgeId: number;
  private currentUserBadgeId: number;
  private currentDownloadId: number;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.lessons = new Map();
    this.quizzes = new Map();
    this.userProgress = new Map();
    this.quizResults = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    this.downloadedContent = new Map();
    
    this.currentUserId = 1;
    this.currentSubjectId = 1;
    this.currentLessonId = 1;
    this.currentQuizId = 1;
    this.currentProgressId = 1;
    this.currentResultId = 1;
    this.currentBadgeId = 1;
    this.currentUserBadgeId = 1;
    this.currentDownloadId = 1;
    
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
    const user: User = { ...insertUser, id, points: 0, avatarUrl: null };
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
    const subject: Subject = { ...insertSubject, id };
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
    const lesson: Lesson = { ...insertLesson, id };
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
        completed: insertProgress.completed,
        timeSpent: insertProgress.timeSpent,
        lastAccessed: insertProgress.lastAccessed
      };
      this.userProgress.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentProgressId++;
      const progress: UserProgress = { ...insertProgress, id };
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
    const content: DownloadedContent = { ...insertContent, id };
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
  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.points - a.points);
  }
}

export const storage = new MemStorage();
