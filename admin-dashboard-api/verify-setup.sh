#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}NestJS Backend Setup Verification${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check Node.js
echo -e "${YELLOW}[1/6]${NC} Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_V=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_V"
else
    echo -e "${RED}✗${NC} Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

# Check npm
echo -e "\n${YELLOW}[2/6]${NC} Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_V=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_V"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check if in correct directory
echo -e "\n${YELLOW}[3/6]${NC} Checking project structure..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json found"
else
    echo -e "${RED}✗${NC} package.json not found. Please run this script from admin-dashboard-api directory"
    exit 1
fi

# Check node_modules
echo -e "\n${YELLOW}[4/6]${NC} Checking dependencies installation..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Dependencies not installed yet"
    echo -e "   Run: ${BLUE}npm install${NC}"
fi

# Check TypeScript
echo -e "\n${YELLOW}[5/6]${NC} Checking TypeScript..."
if [ -d "node_modules" ] && command -v npx &> /dev/null; then
    echo -e "${GREEN}✓${NC} TypeScript available via npx"
else
    echo -e "${YELLOW}⚠${NC} TypeScript will be installed with npm install"
fi

# Check environment file
echo -e "\n${YELLOW}[6/6]${NC} Checking environment configuration..."
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
elif [ -f ".env.example" ]; then
    echo -e "${YELLOW}⚠${NC} .env.example found, but .env not created"
    echo -e "   Run: ${BLUE}cp .env.example .env${NC} and update values"
else
    echo -e "${RED}✗${NC} No .env files found"
fi

echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}Setup Instructions${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "1. ${YELLOW}Install dependencies:${NC}"
echo -e "   ${BLUE}npm install${NC}"

echo -e "\n2. ${YELLOW}Create .env file:${NC}"
echo -e "   ${BLUE}cp .env.example .env${NC}"
echo -e "   Update database credentials in .env"

echo -e "\n3. ${YELLOW}Create MySQL database:${NC}"
echo -e "   ${BLUE}mysql -u root -p${NC}"
echo -e "   ${BLUE}CREATE DATABASE admin_dashboard_db;${NC}"
echo -e "   ${BLUE}CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';${NC}"
echo -e "   ${BLUE}GRANT ALL PRIVILEGES ON admin_dashboard_db.* TO 'admin'@'localhost';${NC}"
echo -e "   ${BLUE}FLUSH PRIVILEGES;${NC}"

echo -e "\n4. ${YELLOW}Start development server:${NC}"
echo -e "   ${BLUE}npm run start:dev${NC}"

echo -e "\n5. ${YELLOW}Test API (in another terminal):${NC}"
echo -e "   ${BLUE}curl -X GET http://localhost:3000/health${NC}"

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Next Steps${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo -e "Once backend is running:"
echo -e "1. Test API endpoints using curl (see SETUP.md)"
echo -e "2. Update Angular environment with API URL"
echo -e "3. Create API service in Angular (see FRONTEND_INTEGRATION.md)"
echo -e "4. Test login flow from Angular dashboard"

echo -e "\n${BLUE}Documentation Files:${NC}"
echo -e "• ${BLUE}README.md${NC} - API overview and features"
echo -e "• ${BLUE}SETUP.md${NC} - Detailed setup and testing guide"
echo -e "• ${BLUE}API_DOCUMENTATION.md${NC} - Complete API endpoints reference"
echo -e "• ${BLUE}FRONTEND_INTEGRATION.md${NC} - Angular integration guide"

echo -e "\n${BLUE}========================================${NC}\n"
