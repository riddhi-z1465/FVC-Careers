#!/bin/bash

echo "🚀 FVC Careers Backend - Quick Start Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed or not in PATH."
    echo "   Please install MongoDB: https://www.mongodb.com/docs/manual/installation/"
    echo ""
    read -p "Do you want to continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Navigate to backend directory
cd "$(dirname "$0")"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Create uploads directory
echo ""
echo "📁 Creating uploads directory..."
mkdir -p uploads/resumes
echo "✅ Uploads directory created"

# Ask if user wants to seed the database
echo ""
read -p "Do you want to seed the database with sample jobs? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🌱 Seeding database..."
    node seed.js
fi

echo ""
echo "=========================================="
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  npm run dev    (development mode with auto-reload)"
echo "  npm start      (production mode)"
echo ""
echo "API will be available at: http://localhost:5000/api"
echo "=========================================="
