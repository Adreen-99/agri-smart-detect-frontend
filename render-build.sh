#!/bin/bash
# Build script for Render deployment

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run build

echo "Build completed successfully!"