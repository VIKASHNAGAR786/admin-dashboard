@echo off
REM Admin Dashboard - Start Both Frontend and Backend
REM This script starts both the API and UI in a single command

echo.
echo ========================================
echo  Admin Dashboard - Full Stack Startup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo Node.js is installed: %NODE_VERSION%
echo.
echo Starting both Backend and Frontend...
echo.

REM Install dependencies if needed
echo [1/4] Checking Backend dependencies...
cd admin-dashboard-api
if not exist node_modules (
    echo Installing Backend dependencies...
    call npm install
)
cd ..

echo [2/4] Checking Frontend dependencies...
cd admin-dashborad-ui
if not exist node_modules (
    echo Installing Frontend dependencies...
    call npm install
)
cd ..

echo.
echo [3/4] Starting Backend API on http://localhost:3000...
start cmd /k "cd admin-dashboard-api && npm run start:dev"
timeout /t 3

echo [4/4] Starting Frontend UI on http://localhost:4200...
start cmd /k "cd admin-dashborad-ui && npm start"

echo.
echo ========================================
echo  Application is starting!
echo ========================================
echo.
echo Backend API: http://localhost:3000
echo Frontend UI: http://localhost:4200
echo.
echo Press Ctrl+C in either terminal to stop the respective server.
echo.
pause
