#!/bin/bash

# Design QA Agent - Backend Startup Script

echo "🚀 Starting Design QA Agent Backend..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    echo "Please install Python 3 from https://python.org"
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is required but not installed."
    echo "Please install pip3"
    exit 1
fi

# Install dependencies if requirements.txt exists
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip3 install -r requirements.txt
else
    echo "📦 Installing Python dependencies manually..."
    pip3 install flask flask-cors
fi

# Start the backend server
echo "🌐 Starting Flask server on http://localhost:5001"
echo "📊 Available endpoints:"
echo "  POST /api/analyze - Analyze design data"
echo "  GET /api/analyze/test - Test with sample data"
echo "  GET /health - Health check"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"

python3 backend.py
