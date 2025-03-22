#!/bin/bash

# Stop any running processes
echo "Stopping any running processes..."
killall node 2>/dev/null

# Clean up
echo "Cleaning up..."
rm -rf node_modules
rm -rf build
rm -rf .cache

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Start the development server
echo "Starting development server..."
npm start 