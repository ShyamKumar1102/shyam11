@echo off
echo 🚀 AWS Serverless Deployment Script
echo ==================================

echo 📦 Building React app...
cd frontend
call npm run build
cd ..

echo 🗄️ Creating DynamoDB table...
cd aws-lambda
node create-table.js
cd ..

echo 📦 Packaging Lambda function...
cd aws-lambda
powershell Compress-Archive -Path feedback-handler.js,package.json -DestinationPath feedback-handler.zip -Force
echo ✅ Lambda package created: feedback-handler.zip
cd ..

echo.
echo ✅ Build completed! Next steps:
echo 1. Upload frontend/dist to AWS Amplify
echo 2. Upload aws-lambda/feedback-handler.zip to Lambda
echo 3. Configure API Gateway
echo 4. Set environment variables
echo.
echo See AWS_DEPLOYMENT_GUIDE.md for detailed instructions
pause