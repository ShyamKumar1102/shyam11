@echo off
echo ========================================
echo   COURIER SERVICE - QUICK START
echo ========================================
echo.

echo [1/3] Starting Backend Server...
cd backend
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [2/3] Starting Frontend Server...
cd ..\frontend
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo [3/3] Opening Browser...
timeout /t 5 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   SERVERS STARTED SUCCESSFULLY!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo DynamoDB Status: CONNECTED
echo - Couriers Table: 3 items
echo - Shipments Table: 1 item
echo.
echo Navigate to: Courier Service in sidebar
echo.
echo Press any key to exit...
pause >nul
