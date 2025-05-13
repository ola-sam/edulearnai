import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import { validate, loginSchema, registerSchema } from "./middleware/validation";
import { loginRateLimiter } from "./middleware/rate-limiter";
import { securityHeaders, setCsrfToken, csrfProtection, isAuthenticated } from "./middleware/security";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    // Check if the stored password has the expected format
    if (!stored || !stored.includes('.')) {
      console.warn('Invalid password format detected');
      return false;
    }

    const [hashed, salt] = stored.split(".");
    
    if (!hashed || !salt) {
      console.warn('Missing hash or salt components');
      return false;
    }

    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    
    // Ensure both buffers have the same length before comparison
    if (hashedBuf.length !== suppliedBuf.length) {
      console.warn(`Buffer length mismatch: ${hashedBuf.length} vs ${suppliedBuf.length}`);
      return false;
    }
    
    return timingSafeEqual(hashedBuf, suppliedBuf);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
}

export function setupAuth(app: Express) {
  // Define session settings with better security
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "LearnBrightSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true, // Prevents client-side JS from reading the cookie
      sameSite: 'lax', // Provides CSRF protection
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: storage.sessionStore,
  };

  // Trust first proxy if in production
  if (process.env.NODE_ENV === 'production') {
    app.set("trust proxy", 1);
  }
  
  // Apply security headers middleware
  app.use(securityHeaders);
  
  // Setup session and authentication
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Setup CSRF protection
  app.use(setCsrfToken);

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      } catch (err) {
        return done(err);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Registration endpoint with validation and error handling
  app.post("/api/register", validate(registerSchema), async (req, res, next) => {
    try {
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(409).json({
          error: {
            message: "Username already exists",
            status: 409,
            field: "username"
          }
        });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(req.body.password);
      
      // Remove password from response
      const { password, ...userData } = req.body;
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      // Log in the newly created user
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      next(error);
    }
  });

  // Login endpoint with rate limiting, validation, and better error handling
  app.post("/api/login", loginRateLimiter, validate(loginSchema), (req, res, next) => {
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({
          error: {
            message: "Invalid username or password",
            status: 401
          }
        });
      }
      
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint with CSRF protection
  app.post("/api/logout", csrfProtection, (req, res, next) => {
    try {
      req.logout((err) => {
        if (err) return next(err);
        req.session.destroy((sessionErr) => {
          if (sessionErr) return next(sessionErr);
          res.clearCookie('connect.sid');
          res.status(200).json({ message: "Logged out successfully" });
        });
      });
    } catch (error) {
      console.error('Logout error:', error);
      next(error);
    }
  });

  // Current user endpoint with proper error handling
  app.get("/api/user", (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({
          error: {
            message: "Authentication required",
            status: 401
          }
        });
      }
      
      // Return user data without password
      const { password, ...userWithoutPassword } = req.user as SelectUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('User fetch error:', error);
      res.status(500).json({
        error: {
          message: "Failed to retrieve user information",
          status: 500
        }
      });
    }
  });
}