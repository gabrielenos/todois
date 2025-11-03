# Todo List App - Setup & Start Script
# This script will setup everything and start the application

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Todo List App - Auto Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Create .env.local if not exists
Write-Host "[1/4] Checking .env.local file..." -ForegroundColor Yellow
$envFile = ".env.local"
$envContent = "NEXT_PUBLIC_API_BASE_URL=http://localhost:8000"

if (Test-Path $envFile) {
    Write-Host "✓ .env.local already exists" -ForegroundColor Green
} else {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    Set-Content -Path $envFile -Value $envContent
    Write-Host "✓ .env.local created successfully!" -ForegroundColor Green
}
Write-Host ""

# Step 2: Delete old database
Write-Host "[2/4] Checking database..." -ForegroundColor Yellow
$dbFile = "backend\todo_app.db"
if (Test-Path $dbFile) {
    Write-Host "Deleting old database..." -ForegroundColor Yellow
    Remove-Item $dbFile -Force
    Write-Host "✓ Old database deleted!" -ForegroundColor Green
} else {
    Write-Host "✓ No old database found" -ForegroundColor Green
}
Write-Host ""

# Step 3: Start Backend
Write-Host "[3/4] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "Backend URL: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
Write-Host "✓ Backend starting in new window..." -ForegroundColor Green
Write-Host ""

# Wait a bit for backend to start
Write-Host "Waiting 3 seconds for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Write-Host ""

# Step 4: Start Frontend
Write-Host "[4/4] Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "Frontend URL: http://localhost:3000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
Write-Host "✓ Frontend starting in new window..." -ForegroundColor Green
Write-Host ""

# Done
Write-Host "========================================" -ForegroundColor Green
Write-Host "   Setup Complete! Servers Starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Important URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:8000" -ForegroundColor White
Write-Host "   API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "✨ Two new windows opened:" -ForegroundColor Yellow
Write-Host "   1. Backend Server (Python/FastAPI)" -ForegroundColor White
Write-Host "   2. Frontend Server (Next.js)" -ForegroundColor White
Write-Host ""
Write-Host "⏳ Wait ~10 seconds, then open: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🛑 To stop: Close both server windows" -ForegroundColor Red
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
