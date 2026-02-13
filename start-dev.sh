#!/bin/bash

# Admin Dashboard - Start Both Frontend and Backend
# This script starts both the API and UI in a single command

echo ""
echo "========================================"
echo "  Admin Dashboard - Full Stack Startup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "Node.js version: $(node --version)"
echo ""
echo "Starting both Backend and Frontend..."
echo ""

# Install dependencies if needed
echo "[1/4] Checking Backend dependencies..."
cd admin-dashboard-api
if [ ! -d "node_modules" ]; then
    echo "Installing Backend dependencies..."
    npm install
fi
cd ..

echo "[2/4] Checking Frontend dependencies..."
cd admin-dashborad-ui
if [ ! -d "node_modules" ]; then
    echo "Installing Frontend dependencies..."
    npm install
fi
cd ..

echo ""
echo "[3/4] Starting Backend API on http://localhost:3000..."
cd admin-dashboard-api
npm run start:dev &
BACKEND_PID=$!
cd ..

sleep 2

echo "[4/4] Starting Frontend UI on http://localhost:4200..."
cd admin-dashborad-ui
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "========================================"
echo "  Application is starting!"
echo "========================================"
echo ""
echo "Backend API:  http://localhost:3000"
echo "Frontend UI:  http://localhost:4200"
echo ""
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "To stop the application, run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or press Ctrl+C in this terminal."
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
