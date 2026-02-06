@echo off
echo ========================================
echo   Inventory Management System Tests
echo ========================================
echo.

echo [1/3] Checking if backend is running...
timeout /t 2 /nobreak >nul

echo [2/3] Running Backend API Tests...
cd backend
node test-suite.js
cd ..

echo.
echo [3/3] Running Frontend Tests...
cd frontend
call npm test
cd ..

echo.
echo ========================================
echo   All Tests Completed!
echo ========================================
pause
