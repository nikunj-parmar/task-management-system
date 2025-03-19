#!/bin/bash

# Install dependencies
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "REACT_APP_API_URL=http://localhost:8000" > .env
fi

echo "Frontend dependencies installed successfully!" 