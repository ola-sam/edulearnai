# EduLearnAI - Local Development Guide

This guide will help you set up and run the EduLearnAI application on your local machine after downloading it from Replit.

## Prerequisites

- Node.js (v18 or later recommended)
- npm (v8 or later recommended)
- PostgreSQL (v14 or later recommended)

## Setup Instructions

### 1. Install Dependencies

```bash
cd /path/to/EduLearnAI
npm install
```

### 2. Database Setup

The application uses PostgreSQL with Drizzle ORM. You have two options:

#### Option A: Use a Local PostgreSQL Database

1. Install PostgreSQL if you haven't already:
   ```bash
   # On macOS with Homebrew
   brew install postgresql
   brew services start postgresql
   ```

2. Run the setup script to create and initialize the database:
   ```bash
   # Make the script executable
   chmod +x setup-local-db.sh
   
   # Run the script
   ./setup-local-db.sh
   ```

#### Option B: Continue Using the Neon Database

If you want to continue using the same database from Replit, update the `.env` file with your Neon database URL.

### 3. Environment Configuration

Make sure your `.env` file is properly configured:
```
DATABASE_URL=postgres://localhost:5432/edulearn
NODE_ENV=development
```

### 4. Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5000

## Project Structure

- `client/` - React frontend code
- `server/` - Express.js backend code
- `shared/` - Shared code between client and server

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run db:push` - Push database schema changes

## Troubleshooting

- If you encounter database connection issues, ensure PostgreSQL is running and the DATABASE_URL is correct
- For port conflicts, you can modify the port in `server/index.ts`
