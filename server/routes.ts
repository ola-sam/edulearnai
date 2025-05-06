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
    console.log(`User ${userId} has ${progress.length} progress records`);
    
    // Get user quiz results
    const quizResults = await storage.getQuizResults(userId);
    console.log(`User ${userId} has ${quizResults.length} quiz results`);
    
    // Get all lessons for the user's grade
    const lessons = await storage.getLessonsByGrade(user.grade);
    console.log(`Found ${lessons.length} lessons for grade ${user.grade}`);
    
    // Get all subjects
    const subjects = await storage.getSubjects();
    console.log(`Found ${subjects.length} subjects`);
    
    // Get all quizzes
    const quizzes = await storage.getQuizzes();
    console.log(`Found ${quizzes.length} quizzes`);
    
    // Use our personalized recommendation engine
    const recommendations = generatePersonalizedRecommendations({
      user,
      lessons,
      subjects,
      progress,
      quizResults,
      quizzes
    });
    
    console.log(`Generated ${recommendations.length} recommendations`);
    
    // Always return at least 3 recommendations
    // If we have no recommendations at all, use basic grade-appropriate lessons
    if (recommendations.length === 0) {
      // Create some basic recommendations based on available lessons
      const basicRecommendations = lessons.slice(0, 5).map(lesson => {
        const subject = subjects.find(s => s.id === lesson.subjectId);
        return {
          ...lesson,
          subjectName: subject?.name || 'General',
          subjectIcon: subject?.icon || 'school',
          subjectColor: subject?.color || 'primary',
          priority: 1,
          reason: 'Recommended for your grade level'
        };
      });
      console.log(`Added ${basicRecommendations.length} basic recommendations`);
      return res.json(basicRecommendations);
    }
    
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

  // Teacher-specific routes
  // Middleware to check if user is a teacher
  const requireTeacher = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    if (!req.user.isTeacher) {
      return res.status(403).json({ message: "Forbidden: Teachers only" });
    }
    
    next();
  };
  
  // Get classes for a teacher
  app.get("/api/teacher/classes", requireTeacher, async (req, res) => {
    try {
      const user = req.user!;
      
      // Check if we have classes in the database for this teacher
      let teacherClasses = await storage.getClassesByTeacher(user.id);
      
      // If no classes exist, create some sample data and return it
      if (teacherClasses.length === 0) {
        // Create sample classes for this teacher
        await storage.createClass({
          name: "Math 101",
          description: "Introduction to Mathematics",
          grade: 5,
          subject: "Mathematics",
          teacherId: user.id,
          academicYear: "2025-2026",
          startDate: "2025-08-15",
          endDate: "2026-05-30",
          classCode: "MATH101",
          isActive: true
        });
        
        await storage.createClass({
          name: "Science for Beginners",
          description: "Basic Science Concepts",
          grade: 5,
          subject: "Science",
          teacherId: user.id,
          academicYear: "2025-2026",
          startDate: "2025-08-15",
          endDate: "2026-05-30",
          classCode: "SCI101",
          isActive: true
        });
        
        // Fetch the newly created classes
        teacherClasses = await storage.getClassesByTeacher(user.id);
      }
      
      // Enhance with student count data and format dates for frontend
      const classesWithStudentCount = await Promise.all(
        teacherClasses.map(async (cls) => {
          const students = await storage.getClassEnrollments(cls.id);
          
          // Format the class data for frontend consumption
          const formattedClass = {
            ...cls,
            // Format dates as ISO strings if they're Date objects
            startDate: cls.startDate && typeof cls.startDate === 'object' 
              ? new Date(cls.startDate as any).toISOString().split('T')[0] 
              : cls.startDate,
            endDate: cls.endDate && typeof cls.endDate === 'object'
              ? new Date(cls.endDate as any).toISOString().split('T')[0] 
              : cls.endDate,
            studentCount: students.length
          };
          
          return formattedClass;
        })
      );
      
      res.json(classesWithStudentCount);
    } catch (error) {
      console.error("Error fetching teacher classes:", error);
      res.status(500).json({ message: "Failed to fetch teacher classes" });
    }
  });
  
  // Get recent assignments for a teacher
  app.get("/api/teacher/assignments/recent", requireTeacher, async (req, res) => {
    try {
      const user = req.user!;
      
      // Get recent assignments from storage
      let recentAssignments = await storage.getRecentAssignmentsByTeacher(user.id, 5);
      
      // If no assignments exist, create sample data
      if (recentAssignments.length === 0) {
        // First ensure we have classes to associate with the assignments
        const teacherClasses = await storage.getClassesByTeacher(user.id);
        
        if (teacherClasses.length > 0) {
          // Create sample assignments
          const classIds = teacherClasses.map(cls => cls.id);
          const classNames = teacherClasses.reduce((map, cls) => {
            map[cls.id] = cls.name;
            return map;
          }, {} as Record<number, string>);
          
          // Create the sample assignment with appropriate date formats
          await storage.createAssignment({
            title: "Multiplication Tables Quiz",
            description: "Complete the multiplication tables quiz",
            instructions: "Answer all questions in the quiz",
            classId: classIds[0],
            teacherId: user.id,
            dueDate: new Date("2025-09-15T00:00:00.000Z"),
            assignedDate: new Date("2025-09-01T00:00:00.000Z"),
            points: 100,
            status: "active"
          });
          
          if (classIds.length > 1) {
            await storage.createAssignment({
              title: "Animal Cell Structure",
              description: "Label the parts of an animal cell",
              instructions: "Label all the parts of the cell diagram",
              classId: classIds[1],
              teacherId: user.id,
              dueDate: new Date("2025-09-20T00:00:00.000Z"),
              assignedDate: new Date("2025-09-05T00:00:00.000Z"),
              points: 100,
              status: "active"
            });
          }
          
          // Fetch the newly created assignments
          recentAssignments = await storage.getRecentAssignmentsByTeacher(user.id, 5);
          
          // Add class names to the assignments and format dates
          recentAssignments = recentAssignments.map(assignment => {
            // Create a properly formatted assignment object
            const formattedAssignment = {
              ...assignment,
              className: classNames[assignment.classId] || 'Unknown Class',
            };
            
            // Format the date fields if they exist and are objects
            if (assignment.dueDate && typeof assignment.dueDate === 'object') {
              (formattedAssignment as any).dueDate = new Date(assignment.dueDate as any).toISOString();
            }
            
            if (assignment.assignedDate && typeof assignment.assignedDate === 'object') {
              (formattedAssignment as any).assignedDate = new Date(assignment.assignedDate as any).toISOString();
            }
            
            return formattedAssignment;
          });
        }
      }
      
      res.json(recentAssignments);
    } catch (error) {
      console.error("Error fetching recent assignments:", error);
      res.status(500).json({ message: "Failed to fetch recent assignments" });
    }
  });
  
  // Get analytics summary for a teacher
  app.get("/api/teacher/analytics/summary", requireTeacher, async (req, res) => {
    try {
      const user = req.user!;
      
      // Get analytics data from storage
      const analyticsSummary = await storage.getAnalyticsSummary(user.id);
      
      res.json(analyticsSummary);
    } catch (error) {
      console.error("Error fetching analytics summary:", error);
      res.status(500).json({ message: "Failed to fetch analytics summary" });
    }
  });
  
  // Get all students in a teacher's classes
  app.get("/api/teacher/students", requireTeacher, async (req, res) => {
    try {
      const user = req.user!;
      
      // Get all classes for this teacher
      const teacherClasses = await storage.getClassesByTeacher(user.id);
      
      if (teacherClasses.length === 0) {
        return res.json([]);
      }
      
      // Get all enrollments for these classes
      const classEnrollmentPromises = teacherClasses.map(cls => 
        storage.getClassEnrollments(cls.id)
      );
      
      const classEnrollments = await Promise.all(classEnrollmentPromises);
      
      // Flatten enrollments array
      const allEnrollments = classEnrollments.flat();
      
      if (allEnrollments.length === 0) {
        // If there are no enrollments, create sample enrollments for demo purposes
        const firstClass = teacherClasses[0];
        
        // Create demo student accounts if needed
        let john = await storage.getUserByUsername("john.doe");
        if (!john) {
          john = await storage.createUser({
            username: "john.doe",
            password: "password123", // In a real app, this would be properly hashed
            firstName: "John",
            lastName: "Doe",
            grade: 5,
            role: "student",
            isTeacher: false
          });
        }
        
        let jane = await storage.getUserByUsername("jane.smith");
        if (!jane) {
          jane = await storage.createUser({
            username: "jane.smith",
            password: "password123", // In a real app, this would be properly hashed
            firstName: "Jane",
            lastName: "Smith",
            grade: 5,
            role: "student",
            isTeacher: false
          });
        }
        
        // Enroll the students in the first class
        await storage.createClassEnrollment({
          classId: firstClass.id,
          studentId: john.id,
          enrolledAt: new Date(),
          status: "active"
        });
        
        await storage.createClassEnrollment({
          classId: firstClass.id,
          studentId: jane.id,
          enrolledAt: new Date(),
          status: "active"
        });
        
        // Fetch the newly created enrollments
        const updatedEnrollments = await storage.getClassEnrollments(firstClass.id);
        allEnrollments.push(...updatedEnrollments);
      }
      
      // Create a map to store class names by id for easier lookup
      const classNameMap = teacherClasses.reduce((map, cls) => {
        map[cls.id] = cls.name;
        return map;
      }, {} as Record<number, string>);
      
      // Get student details for each enrollment
      const studentDetailsPromises = allEnrollments.map(async enrollment => {
        const student = await storage.getUser(enrollment.studentId);
        if (!student) return null;
        
        return {
          id: student.id,
          username: student.username,
          firstName: student.firstName,
          lastName: student.lastName,
          grade: student.grade,
          points: student.points,
          enrollmentId: enrollment.id,
          classId: enrollment.classId,
          className: classNameMap[enrollment.classId] || 'Unknown Class'
        };
      });
      
      const studentDetails = (await Promise.all(studentDetailsPromises)).filter(Boolean);
      
      res.json(studentDetails);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });
  
  // Create a new class
  app.post("/api/teacher/classes", requireTeacher, async (req, res) => {
    try {
      const user = req.user!;
      
      // Generate a random class code
      const classCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create the class in the database
      const newClass = await storage.createClass({
        name: req.body.name,
        description: req.body.description,
        grade: req.body.grade,
        subject: req.body.subject,
        teacherId: user.id,
        academicYear: req.body.academicYear,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        classCode: classCode,
        isActive: true
      });
      
      res.json(newClass);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ message: "Failed to create class" });
    }
  });
  
  // Create a new assignment
  app.post("/api/teacher/assignments", requireTeacher, async (req, res) => {
    try {
      const user = req.user!;
      
      // Create the assignment in the database
      const newAssignment = await storage.createAssignment({
        title: req.body.title,
        description: req.body.description,
        instructions: req.body.instructions,
        classId: req.body.classId,
        teacherId: user.id,
        lessonId: req.body.lessonId || null,
        quizId: req.body.quizId || null,
        dueDate: new Date(req.body.dueDate),
        assignedDate: new Date(), // Current date
        points: req.body.points || 100,
        status: "active",
        resources: req.body.resources || null,
        requirements: req.body.requirements || null
      });
      
      res.json(newAssignment);
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });
  
  // Setup the HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
