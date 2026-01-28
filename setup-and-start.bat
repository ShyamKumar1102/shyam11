@echo off
echo ========================================
echo   INVENTORY MANAGEMENT SYSTEM SETUP
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
if not exist "node_modules" (
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Backend dependencies already installed
)

REM Setup database tables
echo 🗄️ Setting up database tables...
node setup-tables.js
if errorlevel 1 (
    echo ❌ Failed to setup database tables
    pause
    exit /b 1
)

cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✅ Frontend dependencies already installed
)

cd ..

echo.
echo ========================================
echo   STARTING INVENTORY MANAGEMENT SYSTEM
echo ========================================
echo.
echo 🚀 Backend will run on: http://localhost:8000
echo 🌐 Frontend will run on: http://localhost:5173
echo.
echo 📝 Default login credentials:
echo    Email: admin@inventory.com
echo    Password: admin123
echo.

REM Start backend server
echo 🔧 Starting backend server...
start "Backend Server - Inventory Management" cmd /k "cd backend && echo Backend Server Starting... && npm run dev"

REM Wait for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend server
echo 🎨 Starting frontend server...
start "Frontend Server - Inventory Management" cmd /k "cd frontend && echo Frontend Server Starting... && npm run dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📋 Next steps:
echo    1. Wait for both servers to fully start
echo    2. Open http://localhost:5173 in your browser
echo    3. Register a new account or use default credentials
echo    4. Start managing your inventory!
echo.
echo 🔧 Troubleshooting:
echo    - If backend fails, check AWS credentials in backend/.env
echo    - If frontend fails, check if port 5173 is available
echo    - Check the opened terminal windows for detailed logs
echo.
pause