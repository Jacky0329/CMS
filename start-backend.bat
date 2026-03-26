@echo off
title Car Management System - Backend
cd /d "%~dp0backend"

echo ============================================
echo  Car Management System - Django Backend
echo ============================================

if not exist ".venv\Scripts\activate.bat" (
    echo [ERROR] Virtual environment not found at backend\.venv
    echo Run: python -m venv .venv  then  pip install -r requirements.txt
    pause
    exit /b 1
)

echo [1/3] Activating virtual environment...
call .venv\Scripts\activate.bat

echo [2/3] Running database migrations...
python manage.py migrate
if errorlevel 1 (
    echo [ERROR] Migration failed. Check your .env database settings.
    pause
    exit /b 1
)

echo [3/3] Starting Django dev server on http://localhost:8000 ...
echo.
echo	admin / Admin1234!
echo.
python manage.py runserver
pause
