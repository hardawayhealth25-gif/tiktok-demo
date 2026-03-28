#!/bin/bash

# Hardaway Labs Social - Run Script
# This script activates the virtual environment and runs the Flask app

set -e

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it from .env.example and add your credentials."
    exit 1
fi

echo "🚀 Starting Hardaway Labs Social - TikTok Demo"
echo "============================================="
echo ""
echo "📍 App running at: http://localhost:5000"
echo "📍 Press Ctrl+C to stop"
echo ""

# Run Flask app
python app.py
