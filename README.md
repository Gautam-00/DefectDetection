# Industrial Defect Detection System

A complete full-stack deep learning application for detecting defects in industrial surfaces. This system combines a Flask REST API backend with a modern React + Vite frontend to provide an intuitive interface for image analysis with professional PDF report generation.

## 🎯 Overview

This project uses ResNet50 neural network with Grad-CAM visualization to:
- **Detect defects** in industrial surface images
- **Classify defect types** with confidence scores
- **Visualize predictions** with heatmaps showing detected regions
- **Generate reports** as professional PDFs
- **Batch process** multiple images at once

## 📁 Project Structure

```
DefectDetection/
├── defect-backend/                 # Flask REST API
│   ├── app.py                      # Main application
│   ├── neu_defect_resnet50.h5      # Pre-trained model
│   ├── requirements.txt            # Python dependencies
│   ├── .gitignore                  # Git ignore rules
│   ├── README.md                   # Backend setup guide
│   └── venv/                       # Virtual environment (not in Git)
│
├── defect-frontend/                # React + Vite Frontend
│   ├── src/
│   │   ├── App.jsx                 # Main React component
│   │   ├── App.css                 # Application styles
│   │   ├── pdfGenerator.js         # PDF generation utility
│   │   └── ...
│   ├── package.json                # npm dependencies
│   ├── .gitignore                  # Git ignore rules
│   ├── README.md                   # Frontend setup guide
│   └── node_modules/               # Dependencies (not in Git)
│
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites
- **Backend**: Python 3.8+
- **Frontend**: Node.js 16+

### Backend Setup (5 minutes)

```bash
cd defect-backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
# OR
source venv/bin/activate     # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

Server will start at `http://127.0.0.1:5000`

### Frontend Setup (5 minutes)

```bash
cd defect-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Application will start at `http://localhost:5173`

## 📖 Detailed Setup

For detailed setup instructions, environment configuration, and troubleshooting:

- **Backend Setup**: See [defect-backend/README.md](./defect-backend/README.md)
- **Frontend Setup**: See [defect-frontend/README.md](./defect-frontend/README.md)

## ✨ Features

### Backend
- ✅ REST API with CORS support
- ✅ Deep learning model inference (ResNet50)
- ✅ Grad-CAM visualization for explainability
- ✅ Image preprocessing and validation
- ✅ Base64 image encoding for API response

### Frontend
- ✅ Drag & drop file upload
- ✅ Paste images from clipboard (Ctrl+V)
- ✅ Real-time batch analysis
- ✅ Live probability visualization
- ✅ Interactive Grad-CAM heatmap display
- ✅ Individual PDF report download
- ✅ Batch PDF report generation
- ✅ Responsive design
- ✅ Modern, smooth UI with animations

## 🔄 Workflow

1. **Upload** → Drag/drop or paste image(s)
2. **Analyze** → Click "Analyze All" button
3. **View** → See predictions, probabilities, and heatmaps
4. **Download** → Get PDF reports (individual or batch)

## 🛠️ Technology Stack

### Backend
- **Flask** - Web framework
- **TensorFlow/Keras** - Deep learning
- **OpenCV** - Computer vision
- **Pillow** - Image processing
- **NumPy** - Numerical computing

### Frontend
- **React 19.2** - UI framework
- **Vite 7.2** - Build tool
- **jsPDF 2.5** - PDF generation
- **HTML2Canvas 1.4** - Canvas rendering

## 📊 API Documentation

### Predict Endpoint

**URL:** `POST /predict`

**Request:**
```bash
curl -X POST http://127.0.0.1:5000/predict \
  -F "image=@image.jpg"
```

**Response:**
```json
{
  "predicted_class": "Punching",
  "probabilities": {
    "Bumps": 0.02,
    "Crazing": 0.05,
    "Punching": 0.88,
    "Scratches": 0.03,
    "Welding": 0.02
  },
  "grad_cam_image_base64": "iVBORw0KGgoAAAANS..."
}
```

## 🐛 Troubleshooting

### General Issues

**Q: Backend connection error**
- Ensure backend is running: `python app.py`
- Check backend URL in frontend code
- Verify both are accessible on your network

**Q: Port already in use**
- Backend: Change port in `app.py` or stop other process
- Frontend: Vite will auto-select next port

**Q: Module not found errors**
- Backend: Ensure virtual environment is activated and dependencies installed
- Frontend: Run `npm install`

### Performance Issues

**Large image files**
- Compress images before upload
- Use appropriate image formats (JPEG for photos)
- Large batches may take time - be patient

**PDF generation slow**
- This is normal for large batches
- Check browser console for errors

## 🌐 Deployment

### Production Checklist

**Backend:**
- [ ] Move model file to proper location
- [ ] Configure environment variables
- [ ] Set `FLASK_DEBUG=False`
- [ ] Use production WSGI server (Gunicorn)
- [ ] Deploy to cloud (Heroku, AWS, Azure, etc.)

**Frontend:**
- [ ] Update `BACKEND_URL` to production API
- [ ] Run `npm run build`
- [ ] Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)
- [ ] Configure CORS if on different domains

## 📝 Git Workflow

### What Gets Committed
✅ Source code (Python, JavaScript)
✅ Configuration files (requirements.txt, package.json)
✅ Documentation (README.md)
✅ Build config (vite.config.js)

### What Gets Ignored
❌ Virtual environments (`venv/`, `node_modules/`)
❌ Build outputs (`dist/`, `__pycache__/`)
❌ Environment files (`.env`)
❌ IDE files (`.vscode/`, `.idea/`)
❌ Large model files (if needed, use LFS)

## 📚 Documentation

- [Backend README](./defect-backend/README.md) - API docs, setup, troubleshooting
- [Frontend README](./defect-frontend/README.md) - UI features, customization, deployment

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

If you encounter issues:
1. Check the relevant README file
2. Review the troubleshooting section
3. Check browser console (F12) and backend logs
4. Create an issue with detailed error messages

## 🎓 Learning Resources

- [Grad-CAM: Why Should I Trust You?](https://arxiv.org/abs/1610.02055)
- [ResNet Deep Learning](https://arxiv.org/abs/1512.03385)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev/)

## 🎉 Getting Help

Start with the most relevant README:
- First time? → Read this file completely
- Setting up backend? → See `defect-backend/README.md`
- Setting up frontend? → See `defect-frontend/README.md`
- Troubleshooting? → Check both README files for common issues
