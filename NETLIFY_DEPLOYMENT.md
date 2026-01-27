# Netlify Deployment Guide

## Prerequisites
- GitHub account
- Netlify account
- AWS account with DynamoDB tables created

## Step 1: Push to GitHub
```bash
cd c:\Users\shyam11\OneDrive\Desktop\INVENTORY
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy to Netlify

### Option A: Netlify Dashboard (Recommended)
1. Go to https://app.netlify.com
2. Click "Add new site" > "Import an existing project"
3. Choose GitHub and select your repository
4. Build settings are auto-detected from `netlify.toml`
5. Click "Deploy site"

### Option B: Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

## Step 3: Configure Environment Variables

Go to: Site Settings > Environment Variables

Add these variables:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_key_here

USERS_TABLE=inventory-users
PRODUCTS_TABLE=inventory-products
STOCK_TABLE=inventory-stock
ORDERS_TABLE=inventory-orders
SUPPLIERS_TABLE=inventory-suppliers
CUSTOMERS_TABLE=inventory-customers
INVOICES_TABLE=inventory-invoices
PURCHASE_ORDERS_TABLE=inventory-purchase-orders
DISPATCH_TABLE=inventory-dispatch
COURIERS_TABLE=inventory-couriers
SHIPMENTS_TABLE=inventory-shipments

JWT_SECRET=your-super-secret-jwt-key-change-this
```

## Step 4: Redeploy
After adding environment variables, trigger a new deploy:
- Go to Deploys tab
- Click "Trigger deploy" > "Deploy site"

## Your Site URLs
- Frontend: https://your-site-name.netlify.app
- API: https://your-site-name.netlify.app/.netlify/functions/api

## Testing
1. Visit your site URL
2. Register a new user
3. Login and test all features

## Troubleshooting

### Functions not working
- Check function logs: Site > Functions > api
- Verify environment variables are set
- Check AWS credentials have DynamoDB permissions

### Build fails
- Check build logs in Netlify dashboard
- Verify all dependencies in package.json
- Check Node version (should be 18)

### API errors
- Open browser console (F12)
- Check Network tab for failed requests
- Verify DynamoDB tables exist in AWS

## Local Development
```bash
# Frontend
cd frontend
npm run dev

# Backend (local)
cd backend
npm run dev
```

## Production URLs
- Replace `http://localhost:8000/api` with `/.netlify/functions/api`
- Already configured in `.env.production`
