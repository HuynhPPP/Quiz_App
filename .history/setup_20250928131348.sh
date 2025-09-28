#!/bin/bash

# Quiz App - Clean and Setup Script
echo "🧹 Cleaning Quiz App workspace..."

# Remove existing node_modules
echo "Removing existing node_modules..."
rm -rf node_modules
rm -rf frontend/node_modules
rm -rf backend/node_modules

# Remove package-lock files
echo "Removing package-lock files..."
rm -f package-lock.json
rm -f frontend/package-lock.json
rm -f backend/package-lock.json

# Remove build artifacts
echo "Removing build artifacts..."
rm -rf frontend/dist

echo "✅ Cleanup completed!"

# Install dependencies
echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install workspace dependencies
echo "Installing workspace dependencies..."
npm install

echo "✅ Installation completed!"

echo ""
echo "🚀 Quiz App is ready!"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start both frontend and backend in development mode"
echo "  npm run dev:frontend  - Start only frontend"
echo "  npm run dev:backend  - Start only backend"
echo "  npm run build        - Build both frontend and backend"
echo "  npm run start        - Start production server"
echo "  npm run seed         - Seed database with initial data"
echo ""
