# 🚀 Deploy to Render (Step-by-Step)

This is the **fastest and easiest way** to deploy your defect detection application.

> **Time needed**: 10 minutes total  
> **Cost**: Free (includes free tier)  
> **Recommended**: ⭐⭐⭐⭐⭐

---

## Prerequisites

- GitHub account with DefectDetection repo
- Render account (https://render.com)
- Vercel account (https://vercel.com) for frontend

---

## Part 1: Deploy Backend to Render

### Step 1: Go to Render Dashboard
- Visit https://render.com
- Sign in or create account (use GitHub for faster signup)
- Click "Dashboard"

### Step 2: Create Web Service
- Click **"+ New"** button (top right)
- Select **"Web Service"**

### Step 3: Connect GitHub Repository
- Under "GitHub", search for **"DefectDetection"**
- Click on your repository
- Render will show: *"Connect this repository?"*
- Click **"Connect"**

### Step 4: Configure Service

Fill in the following details:

```
Name: defect-api
Environment: Python 3
Region: Oregon (closest to you, or select another)
Branch: main
Root Directory: defect-backend
Runtime: Python 3.11
```

### Step 5: Build and Start Commands

Render may auto-detect from Procfile, but verify:

**Build Command:**
```bash
pip install -r requirements.txt
```

**Start Command:**
```bash
gunicorn --workers 4 --worker-class sync --timeout 120 --bind 0.0.0.0:${PORT:-5000} app:app
```

> The Procfile in `defect-backend/` should make this automatic.

### Step 6: Add Environment Variables

Scroll down to **"Environment"** section.

Add these variables by clicking **"Add Environment Variable"**:

| Key | Value | Notes |
|-----|-------|-------|
| `FLASK_ENV` | `production` | Required |
| `PORT` | `5000` | Should already be set |
| `HOST` | `0.0.0.0` | Should already be set |
| `CORS_ORIGINS` | `https://your-frontend.com` | **Replace with your Vercel frontend URL** |
| `MODEL_PATH` | `neu_defect_resnet50.h5` | Path to model |

> **Important**: You'll get your frontend URL from Vercel after deploying frontend. You can update this later.

### Step 7: Deploy Backend

- Click **"Create Web Service"**
- Render will start building (shows progress)
- Wait for message: **"✓ Deploy successful"**
- Copy the URL shown (e.g., `https://defect-api-xxxx.onrender.com`)

### Step 8: Verify Backend is Running

```bash
# Test the health endpoint
curl https://defect-api-xxxx.onrender.com/health

# Should return:
{"status":"healthy","model_loaded":true}
```

> First request takes 30-60 seconds (model loading). Subsequent requests are fast.

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Go to Vercel Dashboard
- Visit https://vercel.com
- Sign in or create account (use GitHub for faster signup)
- Click "Dashboard"

### Step 2: Import Project
- Click **"Add New..."**
- Select **"Project"**
- Search for **"DefectDetection"**
- Click to select repository
- Click **"Import"**

### Step 3: Configure Project

Fill in:

```
Project Name: defect-detection-frontend
Framework Preset: Vite
Root Directory: defect-frontend
Build Command: npm run build
Output Directory: dist
```

### Step 4: Add Environment Variables

Before deploying, scroll to **"Environment Variables"**

Add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://defect-api-xxxx.onrender.com/predict` |

> Use the backend URL from Render (from Part 1, Step 7)

### Step 5: Deploy Frontend

- Click **"Deploy"**
- Vercel will build and deploy
- Wait for message: **"✓ Congratulations! Your project has been successfully deployed"**
- Click the deployment URL shown (e.g., `https://defect-detection-frontend-xxxx.vercel.app`)

---

## Part 3: Connect Backend and Frontend

### Step 1: Get Frontend URL
- From Vercel dashboard, copy your deployed frontend URL
- Example: `https://defect-detection-frontend-xxxx.vercel.app`

### Step 2: Update Backend CORS

Go back to Render:

1. Click your **"defect-api"** service
2. Go to **"Environment"**
3. Find `CORS_ORIGINS` variable
4. Click edit icon
5. Update value to: `https://defect-detection-frontend-xxxx.vercel.app`
6. Click **"Save"**

> Render will auto-redeploy backend with new CORS origin (~1 minute)

### Step 3: Test Integration

1. Open your frontend URL: `https://defect-detection-frontend-xxxx.vercel.app`
2. Upload a test image
3. Click "Analyze"
4. If you see results, it's working! ✅

---

## 🎉 You're Deployed!

Your application is now live on the internet!

### URLs:
- **Frontend**: `https://defect-detection-frontend-xxxx.vercel.app`
- **Backend API**: `https://defect-api-xxxx.onrender.com`
- **API Docs**: `https://defect-api-xxxx.onrender.com/` (JSON response)
- **Health Check**: `https://defect-api-xxxx.onrender.com/health`

### Share with Users
Send them the **frontend URL** only. The backend URL is kept internal and secret.

---

## 📊 Monitoring

### Backend (Render)
1. Go to your service on Render
2. Click **"Logs"** to see live activity
3. Check **"Metrics"** for performance

### Frontend (Vercel)
1. Go to your project on Vercel
2. Click **"Analytics"** to see traffic
3. Check **"Deployments"** for deployment history

---

## 🔄 Updating Your Code

When you make changes locally:

```bash
# 1. Commit changes
git add .
git commit -m "Update defect model"

# 2. Push to GitHub
git push origin main

# 3. Platforms auto-deploy (takes 2-3 minutes)
# No manual action needed!
```

Both Render and Vercel automatically deploy when you push to GitHub.

---

## ❌ Troubleshooting

### Backend Shows "Deploy failed"

**Problem**: Git LFS not tracking model file

**Solution**:
```bash
git lfs install
git lfs track "*.h5"
git add .gitattributes
git commit -m "Track model with Git LFS"
git push origin main
```

### Frontend Shows "API Connection Failed"

**Problem**: `VITE_API_URL` is incorrect or backend not responding

**Solutions**:
1. Verify backend URL is correct in Vercel environment variables
2. Check CORS_ORIGINS in backend includes frontend domain
3. Wait 2-3 minutes for backend redeploy after CORS update
4. Test backend: `curl https://defect-api-xxxx.onrender.com/health`

### Slow First Request

**Normal behavior** - TensorFlow model loads (30-60 seconds)

**Solution**: Users should wait, or send health check request first

```javascript
// Warm up the model
fetch('https://defect-api-xxxx.onrender.com/health')
  .then(r => r.json())
  .then(() => console.log('Backend ready!'));
```

### Model File Not Found

**Problem**: Git LFS not available on Render

**Solution**: 
- Ensure `git lfs ls-files` shows the model file
- Push model with LFS: `git push --all`
- Render auto-installs LFS

---

## 💡 Pro Tips

### Custom Domain (Optional)

1. **Render**: Go to Service → "Render Domain" → click edit
2. **Vercel**: Go to Project → Settings → Domains → add custom domain
3. Update `CORS_ORIGINS` to use new domain

### Environment-Specific URLs

Set different URLs for development vs production:

**Local Development** (`.env.local`):
```env
VITE_API_URL=http://localhost:5000/predict
```

**Production** (Vercel env var):
```env
VITE_API_URL=https://defect-api-xxxx.onrender.com/predict
```

### Logging

Check logs anytime:

**Render**:
- Dashboard → Service → Logs → View past logs

**Vercel**:
- Dashboard → Project → Deployments → Select deployment → Logs

---

## 📚 Next Steps

- [ ] Monitor your app for 24 hours
- [ ] Share with beta testers
- [ ] Collect feedback
- [ ] Make improvements and push updates
- [ ] Plan model retraining with more data

---

## 💰 Cost Breakdown

| Service | Free Tier | Notes |
|---------|-----------|-------|
| Render | 750 compute hours/month | Enough for small app |
| Vercel | Unlimited deployments | No compute hour limit |
| GitHub | Free public repo | Git LFS: 1 GB free |
| **Total** | **Free** | Perfect for startup phase |

---

## ✅ Success Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] CORS configured correctly
- [ ] Test image upload works
- [ ] Results display correctly
- [ ] PDF download works
- [ ] Team can access live URL

---

**Congratulations! Your defect detection system is now live! 🎊**

**Questions?** Check `DEPLOYMENT.md` for detailed platform docs.
