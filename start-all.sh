#!/bin/bash

# 🚀 Design QA Agent - Complete Startup Script
# This script will get both frontend and backend running

echo "🚀 Design QA Agent - Starting Complete Application"
echo "=================================================="

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required. Please install Python 3 from https://python.org"
    exit 1
fi

# Check if Node.js is available  
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Requirements met - Python 3 and Node.js found"
echo ""

# Install Python dependencies
echo "📦 Installing Python backend dependencies..."
pip3 install flask flask-cors

# Install Node.js dependencies
echo "📦 Installing Node.js frontend dependencies..."
npm install

echo ""
echo "🌐 Starting backend server..."
echo "Backend will run on: http://localhost:5001"

# Start backend in background
python3 backend.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Test backend
echo "🧪 Testing backend connectivity..."
if curl -s http://localhost:5001/health > /dev/null; then
    echo "✅ Backend is running successfully!"
else
    echo "❌ Backend failed to start"
    kill $BACKEND_PID
    exit 1
fi

echo ""
echo "🎨 Starting frontend development server..."
echo "Frontend will run on: https://localhost:8080"
echo ""
echo "📋 Available endpoints:"
echo "   • Backend API: http://localhost:5001"
echo "   • Health Check: http://localhost:5001/health"
echo "   • Sample Analysis: http://localhost:5001/api/analyze/test"
echo "   • Frontend App: https://localhost:8080"
echo ""
echo "🎯 Use Ctrl+C to stop both servers"
echo "=================================="

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID 2>/dev/null
    echo "✅ Cleanup complete"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup INT

# Start frontend (this will block)
npm start

# If npm start exits, cleanup
cleanup
