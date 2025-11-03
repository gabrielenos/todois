@echo off
echo ========================================
echo   Todo List App - Quick Start
echo ========================================
echo.
echo Running setup and starting servers...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0setup-and-start.ps1"

if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR: Script gagal dijalankan!
    echo ========================================
    echo.
    echo Kemungkinan penyebab:
    echo 1. Python belum terinstall
    echo 2. Node.js belum terinstall
    echo 3. Dependencies belum terinstall
    echo.
    echo Coba jalankan manual:
    echo   cd backend
    echo   python -m uvicorn main:app --reload
    echo.
    pause
)
