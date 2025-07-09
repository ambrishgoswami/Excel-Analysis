#!/bin/bash

# Deployment build script for React Dashboard
# This script handles environment variables and ensures reliable builds

echo "🚀 Starting deployment build process..."

# Set default environment variables if not provided
export VITE_APP_BASE_URL=${VITE_APP_BASE_URL:-"/"}
export VITE_API_BASE_URL=${VITE_API_BASE_URL:-"http://localhost:5000"}
export NODE_ENV=${NODE_ENV:-"production"}

echo "📋 Environment Configuration:"
echo "   VITE_APP_BASE_URL: $VITE_APP_BASE_URL"
echo "   VITE_API_BASE_URL: $VITE_API_BASE_URL"
echo "   NODE_ENV: $NODE_ENV"

# Clean install dependencies
echo "🧹 Cleaning and reinstalling dependencies..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

echo "✅ Build completed successfully!"
echo "📁 Build output is in the 'dist' directory" 