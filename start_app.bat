@echo off
title AgrIntel - Local Dev Server
echo ================================================
echo   AgrIntel - Agricultural Intelligence Platform  
echo   Local Development Server
echo ================================================
echo.
echo Starting server at: http://localhost:8080
echo.
echo >> Open browser: http://localhost:8080/index.html
echo >> Press Ctrl+C to stop the server
echo.

cd /d "E:\AgrIntel\Frontend components"
start "" "http://localhost:8080/index.html"
python -m http.server 8080
pause
