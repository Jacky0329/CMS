@echo off
title Car Management System - Launcher
echo ============================================
echo  Car Management System - Starting Both
echo ============================================
echo.
echo Opening Backend in a new window...
start "Backend" cmd /k ""%~dp0start-backend.bat""

timeout /t 3 /nobreak >nul

echo Opening Frontend in a new window...
start "Frontend" cmd /k ""%~dp0start-frontend.bat""

echo.
echo Both servers are starting:
echo   Backend  -^>  http://localhost:8000
echo   Frontend -^>  http://localhost:5173
echo   API Docs -^>  http://localhost:8000/api/
echo.
echo
echo You can close this window.
timeout /t 5
