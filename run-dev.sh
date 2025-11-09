#!/bin/bash

echo "Starting Health Community Hub..."
echo

echo "Installing dependencies..."
npm install
cd frontend
npm install
cd ..

echo
echo "Starting Backend and Frontend servers..."
echo "Backend will run on: http://localhost:8000"
echo "Frontend will run on: http://localhost:3000"
echo

# Start backend in background
cd backend
python manage.py runserver &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo
echo "Both servers are starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait




