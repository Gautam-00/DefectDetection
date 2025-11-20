#!/bin/bash

# Quick Setup Script for macOS/Linux
# This script automates the initial setup of both backend and frontend

echo ""
echo "========================================"
echo "Industrial Defect Detection - Setup"
echo "========================================"
echo ""

# Backend Setup
echo "[1/4] Setting up Backend..."
cd defect-backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Backend setup complete!"
cd ..
echo ""

# Frontend Setup
echo "[2/4] Setting up Frontend..."
cd defect-frontend

echo "Installing npm dependencies..."
npm install

echo "Frontend setup complete!"
cd ..
echo ""

# Summary
echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "   cd defect-backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "   cd defect-frontend"
echo "   npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
