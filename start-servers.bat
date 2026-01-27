@echo off
echo ========================================
echo   Inventory Management System
echo   Starting Backend and Frontend...
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server on port 8000...
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

REM Start Frontend Server
echo [2/2] Starting Frontend Server on port 5173...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
echo (Servers will continue running in separate windows)
pause >nul
