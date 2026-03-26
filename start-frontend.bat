@echo off
title Car Management System - Frontend
cd /d "%~dp0frontend"

echo ============================================
echo  Car Management System - React Frontend
echo ============================================

if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

echo Starting Vite dev server on http://localhost:5173 ...
echo.
npm run dev
pause
