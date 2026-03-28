#!/bin/bash

# Hardaway Labs Social - Setup Script
# This script helps set up the TikTok demo application

set -e

echo "🚀 Hardaway Labs Social - TikTok Demo Setup"
echo "==========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9 or higher."
    exit 1
fi

PYTHON_VERSION=$(python3 --version | grep -oP '\d+\.\d+')
echo "✓ Python $PYTHON_VERSION found"

# Create virtual environment
if [ ! -d "venv" ]; then
    echo ""
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment
echo ""
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo ""
echo "📦 Upgrading pip..."
pip install --upgrade pip setuptools wheel > /dev/null 2>&1
echo "✓ pip upgraded"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1
echo "✓ Dependencies installed"

# Check if .env exists
echo ""
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found"
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your TikTok credentials:"
    echo "   - TIKTOK_CLIENT_KEY"
    echo "   - TIKTOK_CLIENT_SECRET"
    echo "   - FLASK_SECRET_KEY"
else
    echo "✓ .env file already exists"
fi

echo ""
echo "==========================================="
echo "✅ Setup complete!"
echo ""
echo "📖 Next steps:"
echo "1. Edit .env with your TikTok credentials"
echo "2. Run: source venv/bin/activate"
echo "3. Run: python app.py"
echo "4. Open: http://localhost:5000"
echo ""
