@echo off
echo Starting Health Community Hub...
echo.

echo Installing dependencies...
call npm install
cd frontend
call npm install
cd ..

echo.
echo Starting Backend and Frontend servers...
echo Backend will run on: http://localhost:8000
echo Frontend will run on: http://localhost:3000
echo.

start "Backend Server" cmd /k "cd backend && python manage.py runserver"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo Both servers are starting...
echo Check the opened terminal windows for server status.
echo.
pause




