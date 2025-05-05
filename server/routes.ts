import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSubjectSchema, insertLessonSchema, insertQuizSchema, insertUserProgressSchema, insertQuizResultSchema, insertBadgeSchema, insertUserBadgeSchema, insertDownloadedContentSchema } from "@shared/schema";
import { z } from "zod";
import { generateTutorResponse, type AITutorRequest } from "./services/openai";
import { generatePersonalizedRecommendations } from "./services/recommendations";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await storage.getUser(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Don't send password in response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id/points", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { points } = z.object({ points: z.number() }).parse(req.body);
      
      const user = await storage.updateUserPoints(id, points);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid points data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user points" });
    }
  });
  
  // Subject routes
  app.get("/api/subjects", async (req, res) => {
    const subjects = await storage.getSubjects();
    res.json(subjects);
  });
  
  app.get("/api/subjects/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid subject ID" });
    }
    
    const subjects = await storage.getSubjects();
    const subject = subjects.find(s => s.id === id);
    
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }
    
    res.json(subject);
  });
  
  app.post("/api/subjects", async (req, res) => {
    try {
      const subjectData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(subjectData);
      res.status(201).json(subject);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid subject data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create subject" });
    }
  });
  
  // Lesson routes
  app.get("/api/lessons", async (req, res) => {
    const { subjectId, grade } = req.query;
    
    let lessons;
    if (subjectId) {
      lessons = await storage.getLessonsBySubject(parseInt(subjectId as string));
    } else if (grade) {
      lessons = await storage.getLessonsByGrade(parseInt(grade as string));
    } else {
      lessons = await storage.getLessons();
    }
    
    res.json(lessons);
  });
  
  app.get("/api/lessons/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const lesson = await storage.getLessonById(id);
    
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    
    res.json(lesson);
  });
  
  app.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = insertLessonSchema.parse(req.body);
      const lesson = await storage.createLesson(lessonData);
      res.status(201).json(lesson);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid lesson data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });
  
  // Quiz routes
  app.get("/api/quizzes", async (req, res) => {
    const { lessonId } = req.query;
    
    let quizzes;
    if (lessonId) {
      const quiz = await storage.getQuizByLessonId(parseInt(lessonId as string));
      quizzes = quiz ? [quiz] : [];
    } else {
      quizzes = await storage.getQuizzes();
    }
    
    res.json(quizzes);
  });
  
  app.get("/api/quizzes/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const quiz = await storage.getQuizById(id);
    
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    
    res.json(quiz);
  });
  
  app.post("/api/quizzes", async (req, res) => {
    try {
      const quizData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quiz data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });
  
  // User Progress routes
  app.get("/api/users/:userId/progress", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const progress = await storage.getUserProgress(userId);
    res.json(progress);
  });
  
  app.post("/api/users/:userId/progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Use the original data but parse the lastAccessed as a Date if it's a string
      const data = {
        ...req.body,
        userId,
        // Ensure completed is a boolean
        completed: !!req.body.completed,
        // Ensure timeSpent is a number
        timeSpent: parseInt(req.body.timeSpent) || 0,
        // Convert lastAccessed string to Date if needed
        lastAccessed: req.body.lastAccessed instanceof Date 
          ? req.body.lastAccessed 
          : new Date(req.body.lastAccessed || Date.now())
      };
      
      const progressData = insertUserProgressSchema.parse(data);
      const progress = await storage.createOrUpdateUserProgress(progressData);
      res.status(201).json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create or update progress" });
    }
  });
  
  // Quiz Results routes
  app.get("/api/users/:userId/quiz-results", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const results = await storage.getQuizResults(userId);
    res.json(results);
  });
  
  app.post("/api/users/:userId/quiz-results", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Prepare quiz result data with proper types
      const data = {
        ...req.body,
        userId,
        // Ensure score and maxScore are numbers
        score: parseInt(req.body.score) || 0,
        maxScore: parseInt(req.body.maxScore) || 0,
        // Convert dateTaken string to Date if needed
        dateTaken: req.body.dateTaken instanceof Date 
          ? req.body.dateTaken 
          : new Date(req.body.dateTaken || Date.now())
      };
      
      const resultData = insertQuizResultSchema.parse(data);
      const result = await storage.createQuizResult(resultData);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid quiz result data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create quiz result" });
    }
  });
  
  // Badges routes
  app.get("/api/badges", async (req, res) => {
    const badges = await storage.getBadges();
    res.json(badges);
  });
  
  app.post("/api/badges", async (req, res) => {
    try {
      const badgeData = insertBadgeSchema.parse(req.body);
      const badge = await storage.createBadge(badgeData);
      res.status(201).json(badge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid badge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create badge" });
    }
  });
  
  // User Badges routes
  app.get("/api/users/:userId/badges", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const badges = await storage.getUserBadges(userId);
    res.json(badges);
  });
  
  app.post("/api/users/:userId/badges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const badgeData = insertUserBadgeSchema.parse({
        ...req.body,
        userId
      });
      const badge = await storage.createUserBadge(badgeData);
      res.status(201).json(badge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user badge data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to assign badge to user" });
    }
  });
  
  // Downloaded Content routes
  app.get("/api/users/:userId/downloads", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const downloads = await storage.getDownloadedContent(userId);
    res.json(downloads);
  });
  
  app.post("/api/users/:userId/downloads", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Ensure proper data types for downloads
      const data = {
        ...req.body,
        userId,
        // Ensure status is a string
        status: req.body.status || 'completed',
        // Ensure progress is a number
        progress: parseInt(req.body.progress) || 100,
        // Convert downloadedAt string to Date if needed
        downloadedAt: req.body.downloadedAt instanceof Date 
          ? req.body.downloadedAt 
          : new Date(req.body.downloadedAt || Date.now()),
      };
      
      const downloadData = insertDownloadedContentSchema.parse(data);
      const download = await storage.createDownloadedContent(downloadData);
      res.status(201).json(download);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid download data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create download" });
    }
  });
  
  app.put("/api/downloads/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { progress, status } = z.object({
        progress: z.number().min(0).max(100),
        status: z.enum(["completed", "in_progress", "paused"])
      }).parse(req.body);
      
      const download = await storage.updateDownloadProgress(id, progress, status);
      
      if (!download) {
        return res.status(404).json({ message: "Download not found" });
      }
      
      res.json(download);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid download progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update download progress" });
    }
  });
  
  // Leaderboard route
  app.get("/api/leaderboard", async (req, res) => {
    const leaderboard = await storage.getLeaderboard();
    
    // Return users without passwords and with limited fields
    const leaderboardData = leaderboard.map(({ id, firstName, lastName, username, grade, points }) => ({
      id,
      firstName,
      lastName,
      username,
      grade,
      points,
      displayName: `${firstName} ${lastName.charAt(0)}.`
    }));
    
    res.json(leaderboardData);
  });
  
  // Recommendations API
  app.get("/api/users/:userId/recommendations", async (req, res) => {
    const userId = parseInt(req.params.userId);
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Get user progress
    const progress = await storage.getUserProgress(userId);
    
    // Get user quiz results
    const quizResults = await storage.getQuizResults(userId);
    
    // Get all lessons for the user's grade
    const lessons = await storage.getLessonsByGrade(user.grade);
    
    // Get all subjects
    const subjects = await storage.getSubjects();
    
    // Get all quizzes
    const quizzes = await storage.getQuizzes();
    
    // Use our personalized recommendation engine
    const recommendations = generatePersonalizedRecommendations({
      user,
      lessons,
      subjects,
      progress,
      quizResults,
      quizzes
    });
    
    // Return top 5 recommendations
    res.json(recommendations.slice(0, 5));
  });

  // AI Tutor routes
  app.post("/api/ai/tutor", async (req, res) => {
    try {
      const tutorRequestSchema = z.object({
        userId: z.number(),
        message: z.string().min(1),
        subject: z.string().optional(),
      });
      
      const { userId, message, subject } = tutorRequestSchema.parse(req.body);
      
      // Get user information for context
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get user progress and quiz results for context
      const progress = await storage.getUserProgress(userId);
      const quizResults = await storage.getQuizResults(userId);
      
      // Get recent lessons
      const recentLessons = [];
      for (const p of progress) {
        const lesson = await storage.getLessonById(p.lessonId);
        if (lesson) {
          recentLessons.push(lesson);
        }
      }
      
      // Create context for AI tutor
      const context: AITutorRequest["context"] = {
        grade: user.grade,
        subject: subject,
        recentLessons: recentLessons.slice(0, 5), // Just the 5 most recent
        quizResults: quizResults.slice(0, 5)      // Just the 5 most recent
      };
      
      // Generate AI response
      const aiResponse = await generateTutorResponse({
        userId,
        message,
        context
      });
      
      // Store user message
      await storage.createChatMessage({
        userId,
        content: message,
        timestamp: new Date(),
        role: "user",
        subject: subject
      });
      
      // Store AI response
      await storage.createChatMessage({
        userId,
        content: aiResponse.content,
        timestamp: new Date(),
        role: "assistant",
        subject: subject
      });
      
      res.json(aiResponse);
    } catch (error) {
      console.error("Error in AI tutor route:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid tutor request", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to generate AI tutor response" });
    }
  });
  
  // Chat history routes for AI tutor
  app.get("/api/users/:userId/chat-history", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const messages = await storage.getChatMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
