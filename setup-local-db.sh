#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up local PostgreSQL database for EduLearnAI...${NC}"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo -e "${RED}PostgreSQL is not installed. Please install it first.${NC}"
    echo -e "On Mac, you can use: ${GREEN}brew install postgresql${NC}"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready &> /dev/null; then
    echo -e "${RED}PostgreSQL service is not running.${NC}"
    echo -e "On Mac, you can start it with: ${GREEN}brew services start postgresql${NC}"
    exit 1
fi

# Create database if it doesn't exist
echo -e "${YELLOW}Creating database 'edulearn' if it doesn't exist...${NC}"
createdb -e edulearn 2>/dev/null || echo -e "${GREEN}Database already exists.${NC}"

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
npm run db:push

echo -e "${GREEN}Database setup complete!${NC}"
echo -e "${YELLOW}You can now run the application with:${NC} ${GREEN}npm run dev${NC}"
