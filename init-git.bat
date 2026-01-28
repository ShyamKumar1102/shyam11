@echo off
echo Initializing Git repository...

git init
git add .
git commit -m "Initial commit - Complete Inventory Management System

Features:
- React frontend with professional UI
- Express.js backend with AWS DynamoDB
- User authentication and authorization
- Product management with barcode generation
- Stock management and tracking
- Order processing and invoicing
- Customer and supplier management
- Dispatch and shipment tracking
- Mobile-responsive design
- AWS deployment ready"

echo.
echo Repository initialized!
echo.
echo Next steps:
echo 1. Create repository on GitHub
echo 2. Run: git remote add origin https://github.com/yourusername/inventory-management.git
echo 3. Run: git push -u origin main
echo.
pause