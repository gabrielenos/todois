@echo off
echo ========================================
echo   Starting Todo List Backend Server
echo ========================================
echo.

cd backend

echo Checking if database exists...
if exist todo_app.db (
    echo Database found. Deleting old database...
    del todo_app.db
    echo Old database deleted!
)

echo.
echo Starting FastAPI server...
echo Backend will run on: http://localhost:8000
echo API Docs available at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
