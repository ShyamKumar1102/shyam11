# Netlify Deployment Guide

## Quick Setup Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy on Netlify

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your repository
5. Netlify will auto-detect settings from `netlify.toml`
6. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: Your backend API URL
7. Click "Deploy site"

### 3. Update API URL

After deployment, update your backend URL in Netlify:
- Site settings → Environment variables
- Add: `VITE_API_BASE_URL=https://your-backend-url.com/api`

## Files Created
- `netlify.toml` - Build configuration
- `.gitignore` - Prevents sensitive files from being pushed

Your site will be live at: `https://your-site-name.netlify.app`
