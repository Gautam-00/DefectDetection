@echo off
REM Quick Setup Script for Windows
REM This script automates the initial setup of both backend and frontend

echo.
echo ========================================
echo Industrial Defect Detection - Setup
echo ========================================
echo.

REM Backend Setup
echo [1/4] Setting up Backend...
cd defect-backend

if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call .\venv\Scripts\activate.bat

echo Installing Python dependencies...
pip install -r requirements.txt

echo Backend setup complete!
cd ..
echo.

REM Frontend Setup
echo [2/4] Setting up Frontend...
cd defect-frontend

echo Installing npm dependencies...
call npm install

echo Frontend setup complete!
cd ..
echo.

REM Summary
echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd defect-backend
echo   .\venv\Scripts\activate.bat
echo   python app.py
echo.
echo Terminal 2 - Frontend:
echo   cd defect-frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause
