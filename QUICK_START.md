# Quick Reference Guide

## 📁 Project Files Overview

```
DefectDetection/
├── 📄 README.md                    ← START HERE! Project overview
├── 📄 SETUP_CHECKLIST.md           ← Setup status and verification
├── 📄 GIT_SETUP_SUMMARY.md         ← Git configuration details
├── 🔧 setup.bat                    ← Windows automatic setup
├── 🔧 setup.sh                     ← Mac/Linux automatic setup
│
├── 📁 defect-backend/
│   ├── 📄 README.md                ← Backend setup & API docs
│   ├── 📄 requirements.txt          ← Python dependencies (use this!)
│   ├── 📄 .gitignore               ← Git ignore rules
│   ├── 🐍 app.py                   ← Flask API server
│   ├── 🧠 neu_defect_resnet50.h5   ← ML model file
│   └── 📁 venv/                    ← Virtual env (ignored by Git)
│
└── 📁 defect-frontend/
    ├── 📄 README.md                ← Frontend setup & features
    ├── 📄 package.json             ← npm dependencies
    ├── 📄 .gitignore               ← Git ignore rules
    ├── ⚛️  src/
    │   ├── App.jsx                 ← Main React component
    │   ├── pdfGenerator.js         ← PDF report generator
    │   ├── App.css                 ← Styles
    │   └── ...
    ├── 🔨 vite.config.js           ← Build config
    └── 📁 node_modules/            ← Dependencies (ignored by Git)
```

## 🚀 Quick Start (Choose Your Method)

### Method 1: Automatic Setup (Recommended)

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### Method 2: Manual Setup

**Backend:**
```bash
cd defect-backend
python -m venv venv
.\venv\Scripts\Activate.ps1           # Windows PowerShell
# OR
source venv/bin/activate             # Mac/Linux
pip install -r requirements.txt
python app.py
# Server runs at http://127.0.0.1:5000
```

**Frontend (new terminal):**
```bash
cd defect-frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

## 📚 Documentation Guide

| Document | Purpose | Read if... |
|----------|---------|-----------|
| **README.md** | Project overview | You're new to the project |
| **defect-backend/README.md** | Backend setup & API | You're setting up or developing backend |
| **defect-frontend/README.md** | Frontend setup & features | You're setting up or developing frontend |
| **GIT_SETUP_SUMMARY.md** | Git configuration | You're managing version control |
| **SETUP_CHECKLIST.md** | Setup verification | You want to verify everything is ready |

## 🔑 Key Files to Know

### Backend
- `app.py` - Main server (run with `python app.py`)
- `requirements.txt` - All Python packages needed
- `.gitignore` - What NOT to commit
- `README.md` - Full backend documentation

### Frontend
- `src/App.jsx` - Main React component
- `package.json` - All npm packages and scripts
- `.gitignore` - What NOT to commit
- `README.md` - Full frontend documentation

## 💾 Git Commands Cheat Sheet

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/you/DefectDetection.git
git push -u origin main

# Clone for new developers
git clone https://github.com/you/DefectDetection.git
cd DefectDetection
./setup.sh  # Automatic setup

# Daily workflow
git status                    # Check changes
git add .                     # Stage changes
git commit -m "message"       # Commit
git push                      # Push to GitHub
git pull                      # Pull latest
```

## 🎯 What Gets Committed to GitHub

✅ **DO Commit:**
```
- Source code (.py, .jsx, .js)
- Configuration (package.json, requirements.txt, vite.config.js)
- Documentation (README.md, .gitignore)
- Model files (neu_defect_resnet50.h5)
```

❌ **DON'T Commit:**
```
- venv/                 (500MB+ virtual environment)
- node_modules/         (300MB+ dependencies)
- __pycache__/          (compiled Python)
- .env                  (sensitive info)
- IDE files             (.vscode/, .idea/)
- Build outputs         (dist/)
- Logs                  (*.log)
```

## 🛠️ Common Commands

| Command | What it does | Terminal |
|---------|------------|----------|
| `python app.py` | Start backend server | Backend terminal |
| `npm run dev` | Start frontend dev server | Frontend terminal |
| `npm run build` | Build frontend for production | Frontend terminal |
| `pip install -r requirements.txt` | Install Python packages | Backend (with venv activated) |
| `npm install` | Install npm packages | Frontend |
| `npm run lint` | Check code quality | Frontend |

## ⚡ Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Activate venv: `source venv/bin/activate` |
| `Port 5000 in use` | Change port in `app.py` or `python -m flask run --port 5001` |
| `npm ERR!` | Try `npm install` again or `npm cache clean --force` |
| `Backend connection error` | Ensure backend running: `python app.py` |
| `Images not processing` | Check browser console (F12) for errors |

## 📞 Getting Help

1. **Read the README** - Most answers are there
2. **Check Browser Console** - F12 to see frontend errors
3. **Check Backend Logs** - Terminal running `python app.py`
4. **Review Troubleshooting** - In relevant README.md

## ✨ Pro Tips

🎯 **Tip 1:** Always run setup scripts from project root
```bash
cd DefectDetection
./setup.sh  # Not ./defect-backend/setup.sh
```

🎯 **Tip 2:** Keep two terminals open
```
Terminal 1: Backend (python app.py)
Terminal 2: Frontend (npm run dev)
```

🎯 **Tip 3:** Frontend hot-reloads, backend doesn't
- Frontend: Save code → Auto-refresh
- Backend: Save code → Must restart server

🎯 **Tip 4:** Check .gitignore before committing large files
- Model files are OK to commit
- node_modules/ and venv/ are NOT

## 🎉 You're Ready!

1. ✅ Clone the repository
2. ✅ Run setup script (`setup.bat` or `setup.sh`)
3. ✅ Start both servers
4. ✅ Open http://localhost:5173
5. ✅ Start using the application!

---

**Need more help?** Check the full README.md or relevant component README.md files.

**For deployment?** See frontend/README.md section on "Deployment"

**For API details?** See backend/README.md section on "API Endpoints"
