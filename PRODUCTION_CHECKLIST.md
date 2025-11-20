# 📋 Production Deployment Checklist

Complete this checklist to ensure your application is production-ready before deployment.

## Pre-Deployment Checklist

### Code Quality
- [ ] All code is committed and pushed to GitHub
- [ ] Model file (neu_defect_resnet50.h5) is tracked with Git LFS
- [ ] No hardcoded URLs or secrets in code
- [ ] Environment variables are used for all configuration

### Backend Configuration
- [ ] `defect-backend/requirements.txt` includes all dependencies
- [ ] `defect-backend/.env.example` is created with template variables
- [ ] `defect-backend/.env.production` is ready for production values
- [ ] `defect-backend/Procfile` exists for platform deployment
- [ ] `defect-backend/runtime.txt` specifies Python version (3.11)
- [ ] `app.py` loads environment variables with `load_dotenv()`
- [ ] CORS is configured for your frontend domain
- [ ] Health check endpoint (`/health`) is implemented

### Frontend Configuration
- [ ] `defect-frontend/package.json` has all required dependencies
- [ ] `defect-frontend/.env.example` is created with template variables
- [ ] `defect-frontend/.env.production` is ready for production values
- [ ] `App.jsx` uses `import.meta.env.VITE_API_URL` for backend URL
- [ ] Build process is optimized: `npm run build`

### Testing
- [ ] Backend API tested locally
- [ ] Frontend tested with production API URL
- [ ] Image upload and analysis works end-to-end
- [ ] PDF download functionality works
- [ ] Batch processing works correctly
- [ ] Error handling displays user-friendly messages

### Documentation
- [ ] `README.md` is comprehensive and clear
- [ ] `DEPLOYMENT.md` has step-by-step instructions
- [ ] Environment variables are documented
- [ ] Team members know how to update configuration

---

## Deployment Steps

### Step 1: Prepare Backend (.env)

Create `.env` file in `defect-backend/` directory:

```env
FLASK_ENV=production
PORT=5000
HOST=0.0.0.0
CORS_ORIGINS=https://your-frontend-domain.com
MODEL_PATH=neu_defect_resnet50.h5
```

**Important**: Replace `https://your-frontend-domain.com` with your actual frontend URL.

### Step 2: Prepare Frontend (.env.local)

Create `.env.local` file in `defect-frontend/` directory:

```env
VITE_API_URL=https://your-backend-url.com/predict
VITE_APP_NAME=Industrial Defect Detection
```

**Important**: Replace `https://your-backend-url.com` with your actual backend URL.

### Step 3: Commit Changes

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 4: Deploy Backend

Choose one platform:

**Option A: Render (Recommended)**
- Go to render.com
- Click "New+" → "Web Service"
- Connect repository and select root directory: `defect-backend/`
- Set start command: Use `Procfile` (automatic)
- Add environment variables from `.env`
- Deploy

**Option B: Heroku**
```bash
cd defect-backend
heroku create your-app-name
heroku config:set FLASK_ENV=production CORS_ORIGINS=your-frontend-url
git push heroku main
```

**Option C: Azure/AWS**
- See detailed instructions in `DEPLOYMENT.md`

### Step 5: Deploy Frontend

**Recommended: Vercel**
- Go to vercel.com
- Import GitHub repository
- Select `defect-frontend` as root directory
- Set `VITE_API_URL` environment variable with backend URL
- Deploy

**Alternative: Netlify**
- Go to netlify.com
- Connect GitHub repository
- Build command: `npm run build`
- Publish directory: `dist`
- Set `VITE_API_URL` environment variable
- Deploy

### Step 6: Test Production URLs

```bash
# Test backend health
curl https://your-backend-url.com/health

# Expected response:
# {"status":"healthy","model_loaded":true}

# Test frontend
# Open https://your-frontend-url.com in browser
# Upload an image and verify it processes correctly
```

### Step 7: Update DNS (if using custom domain)

If using custom domain:
- Point domain DNS to platform's nameservers
- Update `CORS_ORIGINS` and `VITE_API_URL` with new domain

---

## Configuration Reference

### Backend Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `FLASK_ENV` | `production` | Flask environment mode |
| `PORT` | `5000` | Port to run server on |
| `HOST` | `0.0.0.0` | Host to bind to |
| `CORS_ORIGINS` | `https://app.example.com` | Comma-separated CORS origins |
| `MODEL_PATH` | `neu_defect_resnet50.h5` | Path to TensorFlow model |

### Frontend Environment Variables

| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://api.example.com/predict` | Backend API endpoint |
| `VITE_APP_NAME` | `Defect Detection` | Application name |

---

## Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Update `CORS_ORIGINS` to match your frontend domain exactly
```env
# ❌ Wrong - missing https://
CORS_ORIGINS=my-app.vercel.app

# ✅ Correct
CORS_ORIGINS=https://my-app.vercel.app
```

### Issue: API Connection Failed
**Solution**: 
1. Verify `VITE_API_URL` is correct and includes `/predict`
2. Test backend with: `curl https://your-backend-url.com/health`
3. Check that backend and frontend are on different domains

### Issue: Model Not Loading
**Solution**:
1. Ensure Git LFS is enabled: `git lfs ls-files`
2. Model file should be ~245 MB
3. Deploy with platform that supports large files (Render, not AWS free tier)

### Issue: Slow First Request
**Solution**: Normal behavior (TensorFlow model loading takes 30-60 seconds)
- Send health check request after deployment to warm up model
- Subsequent requests will be fast (< 5 seconds)

---

## Monitoring & Maintenance

### Check Logs

**Render**
- Dashboard → Select service → Logs tab

**Heroku**
```bash
heroku logs --tail
```

**Vercel**
- Dashboard → Select project → Deployments → Logs

### Update Model

To update the TensorFlow model:

1. Replace `neu_defect_resnet50.h5` in `defect-backend/` directory
2. Commit and push:
   ```bash
   git add defect-backend/neu_defect_resnet50.h5
   git commit -m "Update defect detection model"
   git push origin main
   ```
3. Platforms will auto-deploy (may take 2-5 minutes)

### Scale Backend (if needed)

**Render**: Change plan in dashboard
**Heroku**: `heroku ps:scale web=2`
**AWS**: Increase instance type in Elastic Beanstalk

---

## Security Best Practices

✅ **DO**
- Use HTTPS (all platforms provide automatic)
- Keep environment variables secret (never commit .env)
- Use specific CORS origins (not `*`)
- Keep dependencies updated

❌ **DON'T**
- Store secrets in code
- Use hardcoded URLs
- Allow CORS from all origins
- Skip environment variable configuration

---

## Rollback Plan

If deployment has issues:

### For Backend
```bash
# Render: Automatic - select previous version in dashboard
# Heroku: heroku releases:rollback
```

### For Frontend
```bash
# Vercel: Automatic - select previous deployment
# Netlify: Automatic - select previous deploy
```

---

## Support Resources

- **Platform Docs**: Check platform-specific documentation
- **Flask Deployment**: https://flask.palletsprojects.com/deployment/
- **React Build Guide**: https://vitejs.dev/guide/build.html
- **TensorFlow Model**: https://tensorflow.org/guide/saved_model

---

## Maintenance Schedule

- [ ] Weekly: Check logs for errors
- [ ] Monthly: Update dependencies with `npm update` and `pip install --upgrade`
- [ ] Quarterly: Review security advisories
- [ ] Annually: Plan model retraining if accuracy drops

---

**Ready to deploy? Follow steps 1-7 above. Good luck! 🚀**
