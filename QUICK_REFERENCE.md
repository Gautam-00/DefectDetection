# 🚀 Quick Reference Card

Print this or keep it handy during deployment!

---

## Environment Variables

### Backend (defect-backend/.env)
```
FLASK_ENV=production
PORT=5000
HOST=0.0.0.0
CORS_ORIGINS=https://your-frontend.com
MODEL_PATH=neu_defect_resnet50.h5
```

### Frontend (defect-frontend/.env.local)
```
VITE_API_URL=https://your-backend.com/predict
VITE_APP_NAME=Industrial Defect Detection
```

---

## Deployment Commands

### Push to GitHub
```bash
git add .
git commit -m "message"
git push origin main
```

### Deploy Backend to Render
1. Go to render.com
2. New → Web Service → Connect GitHub
3. Set root: defect-backend/
4. Add env vars
5. Deploy!

### Deploy Frontend to Vercel
1. Go to vercel.com
2. Import → Select repo
3. Root: defect-frontend/
4. Add VITE_API_URL
5. Deploy!

---

## Testing

### Test Backend Health
```bash
curl https://your-backend.com/health
```

Expected: `{"status":"healthy","model_loaded":true}`

### Test Frontend
1. Open frontend URL in browser
2. Upload image
3. Click Analyze
4. Verify results

---

## Key Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| `DEPLOY_TO_RENDER.md` | Fastest deployment guide | 10 min |
| `DEPLOYMENT.md` | All platforms guide | 20 min |
| `PRODUCTION_CHECKLIST.md` | Pre-deployment check | 5 min |
| `DEPLOYMENT_READY.md` | Architecture overview | 5 min |
| `CONFIG_SUMMARY.md` | What was configured | 10 min |

---

## Monitoring URLs

After deployment:

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-api.onrender.com`
- **Health**: `https://your-api.onrender.com/health`
- **Render Logs**: Render Dashboard → Logs
- **Vercel Logs**: Vercel Dashboard → Deployments

---

## Common Issues

### "API Connection Failed"
→ Check `VITE_API_URL` in Vercel env vars

### "Deploy Failed" (backend)
→ Ensure Git LFS is tracking model file

### "Model Loading Slow"
→ Normal (30-60 sec first time)

### "CORS Error"
→ Update `CORS_ORIGINS` to match frontend domain

---

## Files Changed

✅ defect-backend/app.py (environment variables)
✅ defect-backend/requirements.txt (gunicorn + dotenv)
✅ defect-frontend/src/App.jsx (VITE_API_URL)
✅ defect-backend/.env.example (template)
✅ defect-backend/.env.production (config)
✅ defect-frontend/.env.example (template)
✅ defect-frontend/.env.production (config)
✅ defect-backend/Procfile (deployment)
✅ defect-backend/runtime.txt (python version)

---

## Timeline

| Step | Platform | Time |
|------|----------|------|
| 1 | Create Render account | 2 min |
| 2 | Deploy backend | 3 min |
| 3 | Copy backend URL | 1 min |
| 4 | Create Vercel account | 2 min |
| 5 | Deploy frontend | 3 min |
| 6 | Update CORS_ORIGINS | 1 min |
| 7 | Test integration | 2 min |
| **Total** | | **14 min** |

---

## Success Indicators

✅ Frontend URL loads  
✅ Health check returns success  
✅ Image upload works  
✅ Results display  
✅ PDF download works  
✅ No console errors  

---

**Deployment Guide: See DEPLOY_TO_RENDER.md**

**Questions? Check DEPLOYMENT.md for detailed help**
