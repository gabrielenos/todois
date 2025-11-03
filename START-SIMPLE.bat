@echo off
title Todo List App - Starter
color 0A

echo.
echo ========================================
echo   TODO LIST APP - SIMPLE START
echo ========================================
echo.
echo Checking requirements...
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [X] Python tidak ditemukan!
    echo     Install dari: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Python terinstall
)

REM Check Node
node --version >nul 2>&1
if errorlevel 1 (
    echo [X] Node.js tidak ditemukan!
    echo     Install dari: https://nodejs.org/
    echo.
    pause
    exit /b 1
) else (
    echo [OK] Node.js terinstall
)

echo.
echo ========================================
echo   Starting Backend Server...
echo ========================================
echo.

REM Delete old database
if exist "backend\todo_app.db" (
    echo Deleting old database...
    del "backend\todo_app.db"
    echo [OK] Old database deleted
)

REM Create .env.local if not exists
if not exist ".env.local" (
    echo Creating .env.local...
    echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 > .env.local
    echo [OK] .env.local created
)

echo.
echo Starting Backend in new window...
start "Backend Server - DO NOT CLOSE" cmd /k "cd /d "%~dp0backend" && echo ======================================== && echo    BACKEND SERVER RUNNING && echo ======================================== && echo. && echo Backend URL: http://localhost:8000 && echo API Docs: http://localhost:8000/docs && echo. && echo Press Ctrl+C to stop && echo. && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Starting Frontend Server...
echo ========================================
echo.

echo Starting Frontend in new window...
start "Frontend Server - DO NOT CLOSE" cmd /k "cd /d "%~dp0" && echo ======================================== && echo    FRONTEND SERVER RUNNING && echo ======================================== && echo. && echo Frontend URL: http://localhost:3000 && echo. && echo Press Ctrl+C to stop && echo. && npm run dev"

echo.
echo ========================================
echo   SERVERS STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:3000
echo.
echo Two new windows opened:
echo   1. Backend Server (Python/FastAPI)
echo   2. Frontend Server (Next.js)
echo.
echo Wait 10 seconds, then open: http://localhost:3000
echo.
echo To STOP: Close both server windows
echo.
echo ========================================
echo.
pause
