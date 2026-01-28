@echo off
title AWS Environment Setup - Inventory Management System
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                        AWS ENVIRONMENT SETUP                                ║
echo ║                    Inventory Management System                               ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

echo This script will help you configure your AWS credentials for the inventory system.
echo.
echo You'll need:
echo   1. AWS Account with DynamoDB access
echo   2. AWS Access Key ID
echo   3. AWS Secret Access Key
echo   4. AWS Region (e.g., us-east-1, eu-west-1)
echo.

set /p CONTINUE="Do you want to continue? (y/n): "
if /i not "%CONTINUE%"=="y" (
    echo Setup cancelled.
    pause
    exit /b 0
)

echo.
echo Please enter your AWS credentials:
echo.

set /p AWS_REGION="AWS Region (e.g., us-east-1): "
set /p AWS_ACCESS_KEY_ID="AWS Access Key ID: "
set /p AWS_SECRET_ACCESS_KEY="AWS Secret Access Key: "

if "%AWS_REGION%"=="" (
    echo ❌ AWS Region is required
    pause
    exit /b 1
)

if "%AWS_ACCESS_KEY_ID%"=="" (
    echo ❌ AWS Access Key ID is required
    pause
    exit /b 1
)

if "%AWS_SECRET_ACCESS_KEY%"=="" (
    echo ❌ AWS Secret Access Key is required
    pause
    exit /b 1
)

echo.
echo Creating backend/.env file...

(
echo AWS_REGION=%AWS_REGION%
echo AWS_ACCESS_KEY_ID=%AWS_ACCESS_KEY_ID%
echo AWS_SECRET_ACCESS_KEY=%AWS_SECRET_ACCESS_KEY%
echo DYNAMODB_TABLE_NAME=inventory-items
echo USERS_TABLE=inventory-users
echo PRODUCTS_TABLE=inventory-products
echo STOCK_TABLE=inventory-stock
echo ORDERS_TABLE=inventory-orders
echo SUPPLIERS_TABLE=inventory-suppliers
echo CUSTOMERS_TABLE=inventory-customers
echo INVOICES_TABLE=inventory-invoices
echo PURCHASE_ORDERS_TABLE=inventory-purchase-orders
echo DISPATCH_TABLE=inventory-dispatch
echo COURIERS_TABLE=inventory-couriers
echo SHIPMENTS_TABLE=inventory-shipments
echo PORT=8000
echo JWT_SECRET=inventory-jwt-secret-key-2024-secure
echo NODE_ENV=development
) > backend\.env

echo ✅ Environment file created successfully!
echo.
echo Configuration saved to: backend\.env
echo.
echo ⚠️  SECURITY WARNING:
echo    - Never commit the .env file to version control
echo    - Keep your AWS credentials secure
echo    - Use IAM roles in production environments
echo.
echo Next steps:
echo   1. Run launch.bat to start the system
echo   2. The system will automatically create DynamoDB tables
echo   3. Open http://localhost:5173 in your browser
echo.

pause