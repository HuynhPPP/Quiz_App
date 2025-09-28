@echo off
REM Quiz App - Clean and Setup Script for Windows

echo 🧹 Cleaning Quiz App workspace...

REM Remove existing node_modules
echo Removing existing node_modules...
if exist node_modules rmdir /s /q node_modules
if exist frontend\node_modules rmdir /s /q frontend\node_modules
if exist backend\node_modules rmdir /s /q backend\node_modules

REM Remove package-lock files
echo Removing package-lock files...
if exist package-lock.json del package-lock.json
if exist frontend\package-lock.json del frontend\package-lock.json
if exist backend\package-lock.json del backend\package-lock.json

REM Remove build artifacts
echo Removing build artifacts...
if exist frontend\dist rmdir /s /q frontend\dist

echo ✅ Cleanup completed!

REM Install dependencies
echo 📦 Installing dependencies...

REM Install root dependencies
echo Installing root dependencies...
npm install

REM Install workspace dependencies
echo Installing workspace dependencies...
npm install

echo ✅ Installation completed!

echo.
echo 🚀 Quiz App is ready!
echo.
echo Available commands:
echo   npm run dev          - Start both frontend and backend in development mode
echo   npm run dev:frontend  - Start only frontend
echo   npm run dev:backend  - Start only backend
echo   npm run build        - Build both frontend and backend
echo   npm run start        - Start production server
echo   npm run seed         - Seed database with initial data
echo.
pause
