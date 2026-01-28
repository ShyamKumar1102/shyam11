# AWS Serverless Deployment Guide

## 1. AWS Amplify Deployment Steps

### Step 1: Prepare Your React App
```bash
# Build your React app
cd frontend
npm run build

# Test locally
npm run preview
```

### Step 2: Deploy to AWS Amplify
1. Go to AWS Console → Amplify
2. Click "New app" → "Host web app"
3. Choose "Deploy without Git provider"
4. Upload `frontend/dist` folder
5. App name: `inventory-client-preview`
6. Environment: `production`
7. Click "Save and deploy"

### Step 3: Configure Environment Variables
In Amplify Console → App settings → Environment variables:
```
VITE_API_BASE_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/prod
VITE_AWS_REGION=us-east-1
```

## 2. Build Commands

```bash
# Install dependencies
npm install

# Development build
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 3. DynamoDB Table Schema

### Table: client-feedback
- **Partition Key**: id (String)
- **Billing Mode**: Pay per request (Free tier friendly)

### Sample Data Structure:
```json
{
  "id": "1703123456789",
  "title": "Fix navigation menu",
  "description": "The mobile menu doesn't close properly",
  "priority": "high",
  "category": "ui",
  "status": "pending",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

## 4. Lambda Function Setup

### Create Lambda Function:
1. AWS Console → Lambda → Create function
2. Function name: `feedback-handler`
3. Runtime: Node.js 18.x
4. Architecture: x86_64
5. Upload `aws-lambda/feedback-handler.js`

### Environment Variables:
```
FEEDBACK_TABLE=client-feedback
```

## 5. API Gateway Setup

### Create REST API:
1. AWS Console → API Gateway → Create API
2. Choose "REST API" → Build
3. API name: `client-feedback-api`
4. Endpoint type: Regional

### Create Resources and Methods:
```
/feedback
  - GET (List all feedback)
  - POST (Create feedback)
  - OPTIONS (CORS)

/feedback/{id}
  - GET (Get single feedback)
  - PUT (Update feedback)
  - DELETE (Delete feedback)
  - OPTIONS (CORS)
```

### Integration Setup:
- Integration type: Lambda Function
- Lambda Region: us-east-1
- Lambda Function: feedback-handler
- Use Lambda Proxy integration: ✓

### Enable CORS:
1. Select resource → Actions → Enable CORS
2. Access-Control-Allow-Origin: *
3. Access-Control-Allow-Headers: Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token
4. Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS

### Deploy API:
1. Actions → Deploy API
2. Stage name: prod
3. Note the Invoke URL

## 6. React API Integration

### Install Axios:
```bash
npm install axios
```

### API Service:
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const feedbackAPI = {
  // Get all feedback
  getAll: () => axios.get(`${API_BASE_URL}/feedback`),
  
  // Get single feedback
  getById: (id) => axios.get(`${API_BASE_URL}/feedback/${id}`),
  
  // Create feedback
  create: (data) => axios.post(`${API_BASE_URL}/feedback`, data),
  
  // Update feedback
  update: (id, data) => axios.put(`${API_BASE_URL}/feedback/${id}`, data),
  
  // Delete feedback
  delete: (id) => axios.delete(`${API_BASE_URL}/feedback/${id}`)
};
```

## 7. IAM Roles and Permissions

### Lambda Execution Role:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Scan",
        "dynamodb:Query"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:*:table/client-feedback"
    }
  ]
}
```

### API Gateway Execution Role:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:us-east-1:*:function:feedback-handler"
    }
  ]
}
```

## 8. End-to-End Testing

### Step 1: Create DynamoDB Table
```bash
cd aws-lambda
node create-table.js
```

### Step 2: Test Lambda Function
1. AWS Console → Lambda → feedback-handler
2. Test → Create test event
3. Use this test event:
```json
{
  "httpMethod": "POST",
  "body": "{\"title\":\"Test feedback\",\"description\":\"This is a test\",\"priority\":\"medium\",\"category\":\"general\"}"
}
```

### Step 3: Test API Gateway
```bash
# Test GET
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/feedback

# Test POST
curl -X POST https://your-api-id.execute-api.us-east-1.amazonaws.com/prod/feedback \
  -H "Content-Type: application/json" \
  -d '{"title":"API Test","description":"Testing from curl","priority":"low","category":"general"}'
```

### Step 4: Test React App
1. Update `frontend/.env.aws` with your API URL
2. Build and deploy to Amplify
3. Visit your Amplify URL
4. Test feedback form submission
5. Verify data appears in DynamoDB

## 9. AWS Free Tier Usage

- **Amplify**: 1000 build minutes/month, 15GB served/month
- **Lambda**: 1M requests/month, 400,000 GB-seconds compute
- **API Gateway**: 1M API calls/month
- **DynamoDB**: 25GB storage, 25 read/write capacity units

## 10. Deployment Checklist

- [ ] React app builds successfully
- [ ] DynamoDB table created
- [ ] Lambda function deployed with correct permissions
- [ ] API Gateway configured with CORS
- [ ] Environment variables set in Amplify
- [ ] End-to-end testing completed
- [ ] Client can access the public HTTPS URL

## 11. Troubleshooting

### Common Issues:
1. **CORS errors**: Check API Gateway CORS settings
2. **Lambda timeout**: Increase timeout in Lambda configuration
3. **DynamoDB access denied**: Verify IAM permissions
4. **API not found**: Check API Gateway deployment stage

### Debug Steps:
1. Check CloudWatch logs for Lambda errors
2. Test API endpoints individually
3. Verify environment variables
4. Check network tab in browser dev tools