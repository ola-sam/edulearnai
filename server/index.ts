import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import dotenv from 'dotenv';
import { createAdminUser } from "./create-admin";
import { testDatabaseConnection } from "./db";
import { errorHandler } from "./middleware/error-handler";
import { securityHeaders } from "./middleware/security";
import { generalRateLimiter } from "./middleware/rate-limiter";
import { requestTimeout, connectionClosedHandler } from "./middleware/timeout";
import helmet from "helmet";

// Load environment variables from .env file
dotenv.config();

// Global error handler for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...', error);
  process.exit(1);
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...', reason);
  process.exit(1);
});

const app = express();

// Apply security middleware
app.use(helmet()); // Adds various security headers
app.use(securityHeaders); // Our custom security headers
app.use(connectionClosedHandler); // Handle client disconnection
app.use(requestTimeout(30000)); // 30 second timeout for all requests

// Apply rate limiting to all API routes
app.use('/api', generalRateLimiter);

// Body parsing middleware
app.use(express.json({
  limit: '1mb', // Limit request body size
  verify: (req, res, buf) => {
    // Store raw body for signature verification if needed
    (req as any).rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Test database connection before starting the server
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.error('Failed to connect to the database. Please check your database configuration.');
      process.exit(1);
    }
    
    const server = await registerRoutes(app);

    // Enhanced error handling middleware with more details
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      // Log detailed error information
      console.error(`Error ID: ${errorId}`, {
        status,
        message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
      
      // Send a clean response to the client
      res.status(status).json({
        error: {
          message,
          status,
          id: errorId,
          ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
        }
      });
    });
    
    // Add 404 handler for undefined routes
    app.use((_req: Request, res: Response) => {
      res.status(404).json({
        error: {
          message: "Route not found",
          status: 404
        }
      });
    });
    
    // Global error handler - must be after all other middleware and routes
    app.use(errorHandler);

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ALWAYS serve the app on port 5000
    // this serves both the API and the client.
    // It is the only port that is not firewalled.
    const port = 5000;
    const host = process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0';
    
    server.listen({
      port,
      host,
      ...(process.env.NODE_ENV !== 'development' && { reusePort: true }),
    }, async () => {
      log(`serving on ${host}:${port}`);
      
      // Create admin user for local development
      if (process.env.NODE_ENV === 'development') {
        try {
          await createAdminUser('admin', 'SecurePass123', 'Admin', 'User');
        } catch (error) {
          console.error('Failed to create admin user:', error);
        }
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
