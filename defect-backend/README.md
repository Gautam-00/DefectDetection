# Industrial Defect Detection - Backend

A Flask-based REST API for detecting defects in industrial surfaces using deep learning (ResNet50 with Grad-CAM visualization).

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/DefectDetection.git
cd DefectDetection/defect-backend
```

### 2. Create and Activate Virtual Environment

**On Windows (PowerShell):**
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Place the Model File

Ensure the pre-trained model is in the backend directory:
- `neu_defect_resnet50.h5` should be in the same directory as `app.py`

If you don't have the model file, you'll need to train or download it separately.

### 5. Run the Server

```bash
python app.py
```

The API will be available at `http://127.0.0.1:5000`

## 📝 API Endpoints

### POST `/predict`
Analyzes an image for defects.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Form Parameter: `image` (file - image file)

**Response:**
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

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory (optional):

```env
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
```

## 📦 Dependencies

The project uses the following main packages:
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing
- **TensorFlow/Keras** - Deep learning framework
- **NumPy** - Numerical computing
- **OpenCV (cv2)** - Computer vision library
- **Pillow (PIL)** - Image processing

For a complete list, see `requirements.txt`

## 📂 Project Structure

```
defect-backend/
├── app.py                      # Main Flask application
├── neu_defect_resnet50.h5      # Pre-trained model
├── requirements.txt            # Python dependencies
├── .gitignore                  # Git ignore file
└── venv/                       # Virtual environment (not in Git)
```

## 🐛 Troubleshooting

### ModuleNotFoundError: No module named 'tensorflow'
Make sure you've activated the virtual environment and installed dependencies:
```bash
pip install -r requirements.txt
```

### Port 5000 already in use
Change the port in `app.py` or stop the process using port 5000.

### CORS errors in frontend
Ensure the Flask app has CORS enabled and the frontend is calling the correct backend URL.

## 🔗 Frontend Integration

The frontend expects the API at: `http://127.0.0.1:5000/predict`

Make sure both frontend and backend are running simultaneously for the application to work properly.

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [TensorFlow Documentation](https://www.tensorflow.org/)
- [Grad-CAM Paper](https://arxiv.org/abs/1610.02055)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
