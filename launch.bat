@echo off
title Inventory Management System - Setup & Launch
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    INVENTORY MANAGEMENT SYSTEM                               ║
echo ║                         Setup & Launch Script                               ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo After installation, restart this script.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION% is installed
echo.

REM Check if we're in the correct directory
if not exist "backend" (
    echo ❌ ERROR: Backend folder not found
    echo Please run this script from the INVENTORY project root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ ERROR: Frontend folder not found
    echo Please run this script from the INVENTORY project root directory
    pause
    exit /b 1
)

echo [2/6] Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend packages...
    npm install --silent
    if errorlevel 1 (
        echo ❌ Failed to install backend dependencies
        echo Please check your internet connection and try again
        pause
        exit /b 1
    )
    echo ✅ Backend dependencies installed
) else (
    echo ✅ Backend dependencies already installed
)

echo.
echo [3/6] Setting up database tables...
echo This may take a moment...
node setup-tables.js
if errorlevel 1 (
    echo ❌ Failed to setup database tables
    echo Please check your AWS credentials in backend/.env
    echo.
    echo Required environment variables:
    echo - AWS_REGION
    echo - AWS_ACCESS_KEY_ID  
    echo - AWS_SECRET_ACCESS_KEY
    echo.
    pause
    exit /b 1
)

cd ..

echo.
echo [4/6] Installing frontend dependencies...
cd frontend
if not exist "node_modules" (
    echo Installing frontend packages...
    npm install --silent
    if errorlevel 1 (
        echo ❌ Failed to install frontend dependencies
        echo Please check your internet connection and try again
        pause
        exit /b 1
    )
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies already installed
)

cd ..

echo.
echo [5/6] Preparing to launch servers...
echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                              SYSTEM READY                                   ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.
echo 🚀 Backend Server: http://localhost:8000
echo 🌐 Frontend App:   http://localhost:5173
echo.
echo 📝 Getting Started:
echo    1. Register a new account or use existing credentials
echo    2. Add products to your catalog
echo    3. Manage stock levels and locations
echo    4. Track orders and generate invoices
echo    5. Monitor your inventory dashboard
echo.
echo 🔧 Features Available:
echo    ✅ User Authentication & Authorization
echo    ✅ Product Management with Barcode Generation
echo    ✅ Stock Management & Location Tracking
echo    ✅ Order Processing & Income Tracking
echo    ✅ Customer & Supplier Management
echo    ✅ Invoice Generation & Billing
echo    ✅ Dispatch & Shipment Tracking
echo    ✅ Professional Dashboard with Analytics
echo    ✅ Mobile-Responsive Design
echo.

echo [6/6] Starting servers...
echo.

REM Start backend server
echo 🔧 Launching backend server...
start "Backend - Inventory Management API" cmd /k "title Backend Server && color 0E && echo Backend Server Starting... && echo. && cd backend && npm run dev"

REM Wait for backend to initialize
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend server  
echo 🎨 Launching frontend application...
start "Frontend - Inventory Management App" cmd /k "title Frontend Server && color 0B && echo Frontend Server Starting... && echo. && cd frontend && npm run dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📋 Next Steps:
echo    1. Wait for both terminal windows to show "ready" status
echo    2. Open your browser to: http://localhost:5173
echo    3. Register your admin account
echo    4. Start managing your inventory!
echo.
echo 🆘 Troubleshooting:
echo    - Backend issues: Check AWS credentials in backend/.env
echo    - Frontend issues: Ensure port 5173 is available
echo    - Database issues: Verify DynamoDB permissions
echo    - Connection issues: Check if both servers are running
echo.
echo 📚 Documentation:
echo    - README.md: Complete project documentation
echo    - QUICK_START.md: Quick start guide
echo    - AWS_DEPLOYMENT_GUIDE.md: AWS deployment instructions
echo.
echo Press any key to close this window...
pause >nul