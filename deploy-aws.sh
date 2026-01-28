#!/bin/bash

echo "🚀 AWS Serverless Deployment Script"
echo "=================================="

# Step 1: Build React App
echo "📦 Building React app..."
cd frontend
npm run build
cd ..

# Step 2: Create DynamoDB Table
echo "🗄️ Creating DynamoDB table..."
cd aws-lambda
node create-table.js
cd ..

# Step 3: Package Lambda Function
echo "📦 Packaging Lambda function..."
cd aws-lambda
zip -r feedback-handler.zip feedback-handler.js package.json
echo "✅ Lambda package created: feedback-handler.zip"
cd ..

echo ""
echo "✅ Build completed! Next steps:"
echo "1. Upload frontend/dist to AWS Amplify"
echo "2. Upload aws-lambda/feedback-handler.zip to Lambda"
echo "3. Configure API Gateway"
echo "4. Set environment variables"
echo ""
echo "See AWS_DEPLOYMENT_GUIDE.md for detailed instructions"