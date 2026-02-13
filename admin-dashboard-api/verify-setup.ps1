# PowerShell Script for NestJS Backend Setup Verification
# Run from: admin-dashboard-api directory
# Usage: .\verify-setup.ps1

# Color functions
function Write-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠ $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "$Message" -ForegroundColor Cyan
}

function Write-Step {
    param([int]$Number, [string]$Message)
    Write-Host "[$Number/6] $Message" -ForegroundColor Yellow
}

# Header
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "NestJS Backend Setup Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Step 1 "Checking Node.js installation..."
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "Node.js installed: $nodeVersion"
} else {
    Write-Error-Custom "Node.js not found. Please install Node.js 18+ from https://nodejs.org"
    exit 1
}

# Check npm
Write-Host ""
Write-Step 2 "Checking npm installation..."
$npmVersion = npm --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Success "npm installed: $npmVersion"
} else {
    Write-Error-Custom "npm not found"
    exit 1
}

# Check if in correct directory
Write-Host ""
Write-Step 3 "Checking project structure..."
if (Test-Path "package.json") {
    Write-Success "package.json found"
} else {
    Write-Error-Custom "package.json not found. Please run this script from admin-dashboard-api directory"
    exit 1
}

# Check node_modules
Write-Host ""
Write-Step 4 "Checking dependencies installation..."
if (Test-Path "node_modules") {
    Write-Success "Dependencies installed"
} else {
    Write-Warning-Custom "Dependencies not installed yet"
    Write-Host "   Run: npm install" -ForegroundColor Blue
}

# Check TypeScript
Write-Host ""
Write-Step 5 "Checking TypeScript..."
if ((Test-Path "node_modules") -and (Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Success "TypeScript available via npx"
} else {
    Write-Warning-Custom "TypeScript will be installed with npm install"
}

# Check environment file
Write-Host ""
Write-Step 6 "Checking environment configuration..."
if (Test-Path ".env") {
    Write-Success ".env file exists"
} elseif (Test-Path ".env.example") {
    Write-Warning-Custom ".env.example found, but .env not created"
    Write-Host "   Run: copy .env.example .env" -ForegroundColor Blue
} else {
    Write-Error-Custom "No .env files found"
}

# Instructions
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Install dependencies:" -ForegroundColor Yellow
Write-Host "   npm install" -ForegroundColor Blue
Write-Host ""

Write-Host "2. Create .env file:" -ForegroundColor Yellow
Write-Host "   copy .env.example .env" -ForegroundColor Blue
Write-Host "   Update database credentials in .env" -ForegroundColor Blue
Write-Host ""

Write-Host "3. Create MySQL database:" -ForegroundColor Yellow
Write-Host "   mysql -u root -p" -ForegroundColor Blue
Write-Host "   CREATE DATABASE admin_dashboard_db;" -ForegroundColor Blue
Write-Host "   CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin123';" -ForegroundColor Blue
Write-Host "   GRANT ALL PRIVILEGES ON admin_dashboard_db.* TO 'admin'@'localhost';" -ForegroundColor Blue
Write-Host "   FLUSH PRIVILEGES;" -ForegroundColor Blue
Write-Host ""

Write-Host "4. Start development server:" -ForegroundColor Yellow
Write-Host "   npm run start:dev" -ForegroundColor Blue
Write-Host ""

Write-Host "5. Test API (in another PowerShell window):" -ForegroundColor Yellow
Write-Host "   curl.exe -X GET http://localhost:3000/health" -ForegroundColor Blue
Write-Host "   # or" -ForegroundColor Blue
Write-Host "   Invoke-RestMethod -Uri http://localhost:3000/health -Method Get" -ForegroundColor Blue
Write-Host ""

# Next Steps
Write-Host "========================================" -ForegroundColor Green
Write-Host "Next Steps" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Once backend is running:" -ForegroundColor Cyan
Write-Host "1. Test API endpoints using curl (see SETUP.md)" -ForegroundColor White
Write-Host "2. Update Angular environment with API URL" -ForegroundColor White
Write-Host "3. Create API service in Angular (see FRONTEND_INTEGRATION.md)" -ForegroundColor White
Write-Host "4. Test login flow from Angular dashboard" -ForegroundColor White
Write-Host ""

Write-Host "Documentation Files:" -ForegroundColor Cyan
Write-Host "• README.md - API overview and features" -ForegroundColor Blue
Write-Host "• SETUP.md - Detailed setup and testing guide" -ForegroundColor Blue
Write-Host "• API_DOCUMENTATION.md - Complete API endpoints reference" -ForegroundColor Blue
Write-Host "• FRONTEND_INTEGRATION.md - Angular integration guide" -ForegroundColor Blue
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
