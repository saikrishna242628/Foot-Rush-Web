@echo off
title Foot Rush E-Commerce
color 0A
echo.
echo  ___  ___  ___  _____   ___  _   _  ___ _  _
echo ^|  _^|/ _ \/ _ \^|_   _^| ^|  _^|| ^| ^| ^|/ __^| ^|| ^|
echo ^| ^|_^| (_) \__, ^| ^| ^|   ^| ^|_ ^| ^|_^| ^|\__ \ ^__ ^|
echo ^|___^|\___/   /_/  ^|_^|   ^|___^| \___/ ^|___/_^|^|_^|
echo.
echo  Starting Foot Rush E-Commerce Platform...
echo ============================================
echo.

:: Check if dependencies are installed
if not exist "backend\node_modules" (
    echo [1/3] Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo Backend dependencies installed!
    echo.
)

if not exist "frontend\node_modules" (
    echo [2/3] Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo Frontend dependencies installed!
    echo.
)

echo [3/3] Starting servers...
echo.
echo  Backend API:  http://localhost:5000
echo  Frontend App: http://localhost:5173
echo.
echo  Login Credentials:
echo    Admin:    admin@footrush.com / admin123
echo    Customer: customer@example.com / customer123
echo.
echo  Press Ctrl+C to stop all servers.
echo ============================================
echo.

:: Start backend in new window
start "Foot Rush - Backend" cmd /k "cd /d "%~dp0backend" && node server.js"

:: Wait a moment for backend to start
timeout /t 3 /nobreak > nul

:: Start frontend
start "Foot Rush - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

:: Open browser
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo Both servers are running!
echo Close the terminal windows to stop.
pause
