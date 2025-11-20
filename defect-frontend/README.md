# Industrial Defect Detection - Frontend

A modern React + Vite web application for detecting industrial surface defects using deep learning. Upload images, get instant predictions, and download professional PDF reports.

## 📋 Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)
- Backend API running on `http://127.0.0.1:5000`

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/DefectDetection.git
cd DefectDetection/defect-frontend
```

### 2. Install Dependencies

```bash
npm install
```

Or if using yarn:
```bash
yarn install
```

Or if using pnpm:
```bash
pnpm install
```

### 3. Configure Backend URL

The application is configured to connect to `http://127.0.0.1:5000/predict` by default.

To change this, edit `src/App.jsx` and modify the `BACKEND_URL` constant:

```javascript
const BACKEND_URL = "http://your-backend-url/predict";
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use)

### 5. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🎯 Features

- **Drag & Drop Upload** - Drag images directly onto the dropzone
- **Paste Images** - Press Ctrl+V to paste images from clipboard
- **Batch Analysis** - Upload and analyze multiple images at once
- **Real-time Predictions** - Instant defect detection with confidence scores
- **Grad-CAM Visualization** - See which regions were identified as defects
- **Individual PDF Reports** - Download single analysis reports
- **Batch PDF Reports** - Download all analyses in one professional PDF
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Modern UI** - Eye-catching interface with smooth animations

## 📂 Project Structure

```
defect-frontend/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── App.css                 # Application styles
│   ├── main.jsx                # React entry point
│   ├── index.css               # Global styles
│   ├── pdfGenerator.js         # PDF report generation
│   ├── assets/                 # Static assets
│   └── index.html              # HTML template
├── public/                     # Public assets
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── eslint.config.js            # ESLint configuration
├── .gitignore                  # Git ignore file
├── README.md                   # This file
└── node_modules/               # Dependencies (not in Git)
```

## 🎨 Technologies Used

- **React 19.2** - UI framework
- **Vite 7.2** - Build tool and dev server
- **jsPDF 2.5** - PDF generation
- **html2canvas 1.4** - Canvas rendering

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Integration

The frontend communicates with the backend via the `/predict` endpoint.

**Request Format:**
```
POST http://127.0.0.1:5000/predict
Content-Type: multipart/form-data
Form Data: image (file)
```

**Response Format:**
```json
{
  "predicted_class": "defect_type",
  "probabilities": {
    "class1": 0.85,
    "class2": 0.10,
    "class3": 0.05
  },
  "grad_cam_image_base64": "iVBORw0KGgoAAAANS..."
}
```

## 🎬 How to Use

1. **Upload Images**
   - Drag & drop images onto the dropzone
   - Or click to browse and select files
   - Or paste images using Ctrl+V

2. **Analyze**
   - Click "Analyze All" to process all uploaded images
   - Watch the status change from "Pending" → "Processing" → "Done"

3. **View Results**
   - See the original image preview
   - Check the predicted defect type
   - View class probabilities with visual bars
   - Examine the Grad-CAM heatmap

4. **Download Reports**
   - Click "📥 Download Report" on individual results for single PDFs
   - Click "📦 Download All Reports as PDF" to download all as one PDF

5. **Clear**
   - Click "Clear" to remove all images and start over

## 🐛 Troubleshooting

### Backend Connection Error
- Ensure the backend is running: `python app.py`
- Check the backend URL in `src/App.jsx`
- Verify both are on the same network/machine

### Images Not Processing
- Try refreshing the page
- Check browser console for error messages (F12)
- Ensure image files are valid and not corrupted

### PDF Download Not Working
- Check browser console for errors
- Ensure you have JavaScript enabled
- Try a different browser

### Vite Port Already in Use
The dev server will automatically use the next available port or you can specify one:
```bash
npm run dev -- --port 3000
```

## 🚀 Deployment

### Deploy Frontend (Vercel, Netlify, etc.)

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your hosting provider

3. Update the `BACKEND_URL` to point to your production backend

### Deploy Backend (Heroku, AWS, Azure, etc.)

Follow your hosting provider's documentation to deploy the Python Flask application.

## 📝 Environment Variables

Create a `.env` file if you need to use environment-specific URLs:

```env
VITE_API_URL=http://your-backend-url/predict
```

Then update `App.jsx`:
```javascript
const BACKEND_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000/predict";
```

## 🎨 Customization

### Change Colors
Edit the CSS variables in `src/App.css` to customize the color scheme.

### Add More Status Indicators
Modify the `result-card` component in `src/App.jsx` and add corresponding CSS in `src/App.css`

### Modify Report Layout
Edit `src/pdfGenerator.js` to change PDF report formatting

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [Modern CSS](https://web.dev/learn/css/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you encounter any issues, please:
1. Check this README and the troubleshooting section
2. Check the browser console (F12) for error messages
3. Check the backend logs for API errors
