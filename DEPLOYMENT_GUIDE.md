# 🚀 GitHub & Netlify Deployment Guide

## 📋 Prerequisites
- GitHub account
- Netlify account
- Backend deployed (AWS Lambda, Heroku, etc.)

## 🔧 Setup Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Inventory Management System"
git branch -M main
git remote add origin https://github.com/yourusername/inventory-management.git
git push -u origin main
```

### 2. Deploy Frontend to Netlify

#### Option A: Connect GitHub Repository
1. Go to [Netlify](https://netlify.com)
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

#### Option B: Manual Deploy
```bash
cd frontend
npm run build
# Upload dist/ folder to Netlify
```

### 3. Environment Variables
In Netlify dashboard → Site settings → Environment variables:
```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### 4. Backend Deployment Options

#### AWS Lambda (Recommended)
```bash
cd aws-backend
npm install
serverless deploy --stage prod
```

#### Heroku
```bash
cd backend
# Create Procfile: web: node index.js
git subtree push --prefix backend heroku main
```

#### Railway/Render
- Connect backend folder
- Set environment variables
- Deploy

## 🌐 Live URLs
- **Frontend**: https://your-app.netlify.app
- **Backend**: https://your-api-url.com

## 🔒 Security Notes
- Never commit `.env` files
- Use environment variables for all secrets
- Enable HTTPS for production
- Configure CORS for your domain

## 📱 Mobile PWA (Optional)
Add to `frontend/public/manifest.json` for mobile app experience.