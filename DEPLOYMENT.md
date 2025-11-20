# 🚀 Deployment Guide - Industrial Defect Detection

This guide provides step-by-step instructions to deploy the Defect Detection application to production using various platforms.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Deployment Options](#deployment-options)
  - [Option 1: Render (Recommended)](#option-1-render-recommended)
  - [Option 2: Heroku](#option-2-heroku)
  - [Option 3: Azure](#option-3-azure)
  - [Option 4: AWS](#option-4-aws)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

The Defect Detection system consists of:
- **Backend**: Flask REST API (Python)
- **Frontend**: React + Vite (JavaScript)
- **Model**: TensorFlow/Keras ResNet50 (244.88 MB via Git LFS)
- **Total Deployment**: ~250-500 MB (depending on dependencies)

### Architecture
```
┌─────────────────────────┐
│   React Frontend        │
│  (Vercel / Netlify)     │
└────────────┬────────────┘
             │ API Calls
             ↓
┌─────────────────────────┐
│   Flask Backend         │
│  (Render / Heroku)      │
│  - Model Loading        │
│  - Inference            │
│  - Grad-CAM Heatmap     │
└─────────────────────────┘
```

---

## Prerequisites

### Local Machine
- Git with Git LFS: `git lfs install`
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)

### Accounts Required
- GitHub (code repository)
- Hosting platform account (Render/Heroku/Azure/AWS)
- For Frontend: Vercel or Netlify

### Repository Status
- ✅ Code pushed to GitHub with Git LFS
- ✅ Model file tracked via Git LFS
- ✅ Environment templates created (.env.example)

---

## Environment Configuration

### Backend Environment Variables (.env)

Create a `.env` file in `defect-backend/` directory:

```env
# Flask Configuration
FLASK_ENV=production
PORT=5000
HOST=0.0.0.0

# CORS Configuration (for your frontend URL)
CORS_ORIGINS=https://your-frontend-url.com,http://localhost:3000

# Model Configuration
MODEL_PATH=neu_defect_resnet50.h5
```

### Frontend Environment Variables (.env.local)

Create a `.env.local` file in `defect-frontend/` directory:

```env
# API Configuration
VITE_API_URL=https://your-backend-url.com/predict

# App Configuration
VITE_APP_NAME=Defect Detection
```

---

## Deployment Options

### Option 1: Render (Recommended)

Render is a modern PaaS platform ideal for Python/Node.js applications with generous free tier.

#### Backend Deployment (Flask API)

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Choose the `defect-backend/` directory as root
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn --workers 4 --worker-class sync --timeout 120 --bind 0.0.0.0:${PORT:-5000} app:app`
   - Click "Deploy"

4. **Configure Environment Variables in Render**
   - Go to Environment tab
   - Add variables:
     - `FLASK_ENV` = `production`
     - `CORS_ORIGINS` = `https://your-frontend-url.com`
     - `MODEL_PATH` = `neu_defect_resnet50.h5`

5. **Get Backend URL**
   - After deployment, you'll have a URL like: `https://defect-backend-xxxx.onrender.com`
   - Copy this URL

#### Frontend Deployment (React App)

1. **Deploy to Vercel** (Recommended for Vite)
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
   
2. **Configure Environment Variables in Vercel**
   - Add `VITE_API_URL` = `https://defect-backend-xxxx.onrender.com/predict`

3. **Deploy**
   - Click Deploy
   - Wait for completion (~2-3 minutes)

#### Test Deployment
```bash
# Test backend health
curl https://defect-backend-xxxx.onrender.com/health

# Response should be:
# {"status":"healthy","model_loaded":true}
```

---

### Option 2: Heroku

Heroku provides an easy deployment experience but has limited free tier (may require credit card).

#### Backend Deployment

1. **Install Heroku CLI**
   ```bash
   # Windows
   choco install heroku
   # or download from heroku.com/cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   cd defect-backend
   heroku create your-defect-app-name
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set FLASK_ENV=production
   heroku config:set CORS_ORIGINS=https://your-frontend-url.com
   heroku config:set MODEL_PATH=neu_defect_resnet50.h5
   ```

5. **Deploy**
   ```bash
   git push heroku main
   # or if deploying from subdirectory:
   git subtree push --prefix defect-backend heroku main
   ```

6. **Monitor Logs**
   ```bash
   heroku logs --tail
   ```

#### Frontend Deployment to Vercel
- Same as Option 1 (Frontend Deployment)

---

### Option 3: Azure

Azure offers enterprise-grade deployment with generous free tier.

#### Backend Deployment

1. **Create Azure Account**
   - Go to [portal.azure.com](https://portal.azure.com)
   - Create a new "App Service"

2. **Create App Service**
   - Resource Group: Create new
   - Name: `defect-api`
   - Runtime Stack: Python 3.11
   - Region: Select nearest to you

3. **Configure Deployment**
   - Go to "Deployment Center"
   - Source: GitHub
   - Organization: Your GitHub account
   - Repository: DefectDetection
   - Branch: main

4. **Set Environment Variables**
   - Go to Configuration → Application Settings
   - Add:
     - `FLASK_ENV` = `production`
     - `CORS_ORIGINS` = `https://your-frontend-url.com`
     - `MODEL_PATH` = `neu_defect_resnet50.h5`

5. **Configure Startup Command**
   - Go to Configuration → General Settings
   - Startup Command: `gunicorn --workers 4 --worker-class sync --timeout 120 --bind 0.0.0.0:${PORT:-5000} app:app`

6. **Deploy**
   - Save and wait for deployment

#### Frontend Deployment to Vercel
- Same as Option 1 (Frontend Deployment)

---

### Option 4: AWS

AWS provides scalable deployment with free tier available.

#### Backend Deployment (Elastic Beanstalk)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize Elastic Beanstalk**
   ```bash
   cd defect-backend
   eb init -p python-3.11 defect-api --region us-east-1
   ```

3. **Create Environment**
   ```bash
   eb create defect-api-env
   ```

4. **Set Environment Variables**
   ```bash
   eb setenv FLASK_ENV=production CORS_ORIGINS=https://your-frontend-url.com MODEL_PATH=neu_defect_resnet50.h5
   ```

5. **Deploy**
   ```bash
   eb deploy
   ```

6. **Get URL**
   ```bash
   eb open  # Opens your app in browser
   ```

#### Frontend Deployment to Vercel
- Same as Option 1 (Frontend Deployment)

---

## Post-Deployment

### 1. Verify Deployment

**Test Backend API**
```bash
# Health check
curl https://your-backend-url.com/health

# Test prediction with a sample image
curl -X POST \
  -F "image=@path/to/test_image.jpg" \
  https://your-backend-url.com/predict
```

**Test Frontend**
- Open your frontend URL in browser
- Upload a test image
- Verify results display correctly

### 2. Enable HTTPS/SSL
- Most platforms (Render, Vercel, Heroku) provide automatic HTTPS
- Update `CORS_ORIGINS` to use HTTPS URLs only in production

### 3. Monitor Application
- **Render**: Metrics dashboard
- **Heroku**: Heroku Dashboard
- **Azure**: Application Insights
- **AWS**: CloudWatch

### 4. Setup Logging
```python
# Already configured in app.py
# Logs will appear in:
# - Render: Dashboard → Logs
# - Heroku: heroku logs --tail
# - Azure: Log Stream
# - AWS: CloudWatch Logs
```

---

## Troubleshooting

### Backend Issues

#### "ModuleNotFoundError: No module named 'tensorflow'"
```bash
# Reinstall dependencies
pip install -r requirements.txt

# On Render/Heroku: This should happen automatically
# If not, trigger a rebuild from the platform dashboard
```

#### "Model file not found (neu_defect_resnet50.h5)"
```bash
# Ensure Git LFS is installed and tracked:
git lfs ls-files

# If model not pulling:
git lfs pull

# For deployment platforms:
# 1. Ensure model file is tracked in Git LFS
# 2. Platform must have Git LFS support enabled
# 3. Some platforms (like AWS free tier) may not support large LFS files
```

#### CORS Errors in Frontend
- Check `CORS_ORIGINS` environment variable matches frontend URL
- Example: If frontend is at `https://myapp.vercel.app`
- Set `CORS_ORIGINS=https://myapp.vercel.app`

#### Timeout Errors on First Request
- First model load takes 30-60 seconds
- Gunicorn timeout set to 120 seconds (in Procfile)
- This is normal; subsequent requests will be fast

### Frontend Issues

#### "API request failed" / "Network error"
- Check `VITE_API_URL` environment variable
- Ensure backend URL is correct
- Test backend health: `curl https://your-backend-url.com/health`
- Check browser console for CORS errors

#### Build Fails on Vercel
```bash
# Test build locally first
npm run build

# If issues, check:
# 1. Node version: npm --version (needs 14+)
# 2. Dependencies: npm install
# 3. Environment variables in Vercel dashboard
```

### Model Loading Issues

#### Long First Request
- TensorFlow model loading takes time on first request
- This is expected and normal
- Solution: Use health check endpoint to warm up model

```javascript
// Warm up model after deployment
fetch('https://your-backend-url.com/health')
  .then(r => r.json())
  .then(data => console.log('Backend ready:', data));
```

---

## Quick Start Commands

### Deploy to Render (Fastest)
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to render.com and connect your repository
# 3. Set environment variables in Render dashboard
# 4. Done! Render auto-deploys on push
```

### Deploy to Heroku
```bash
heroku create your-app-name
heroku config:set FLASK_ENV=production CORS_ORIGINS=your-frontend-url
git push heroku main
heroku logs --tail
```

### Local Testing Before Deployment
```bash
# Backend
cd defect-backend
python -m venv venv
source venv/Scripts/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Frontend (in another terminal)
cd defect-frontend
npm install
npm run dev
# Visit http://localhost:5173
```

---

## Performance Optimization

### Backend
- Model is pre-loaded on startup (~30-60 seconds)
- Workers: 4 (adjust based on platform limits)
- Timeout: 120 seconds (for model inference)

### Frontend
- Vite provides optimized build
- CSS and JS are minified
- Images should be under 5MB

### Costs
- **Render**: Free tier includes 750 compute hours/month
- **Heroku**: Free tier deprecated; paid tier starts at $5/month
- **Vercel**: Free tier includes unlimited deployments
- **Azure**: Free tier includes 1 year of popular services
- **AWS**: Free tier includes 1 year of limited resources

---

## Support & Resources

- **Render Documentation**: https://render.com/docs
- **Heroku Documentation**: https://devcenter.heroku.com
- **Vercel Documentation**: https://vercel.com/docs
- **Azure Documentation**: https://docs.microsoft.com/azure
- **Flask Deployment**: https://flask.palletsprojects.com/deployment

---

## Next Steps

1. ✅ Configure environment variables
2. ✅ Choose deployment platform
3. ✅ Deploy backend first
4. ✅ Deploy frontend
5. ✅ Test production URLs
6. ✅ Monitor and maintain

**Good luck! 🚀**
