@echo off
echo 🚀 Starting VitalAI Analytics System...
echo.

echo 📊 Starting Dashboard Server...
start python dashboard_server.py

timeout /t 3 /nobreak >nul

echo 🏥 Starting FastAPI Server...
start python data-engineer\mysql_fastapi.py

echo.
echo ✅ Both servers are starting...
echo 📊 Dashboard: http://localhost:8080
echo 🔧 API Docs: http://localhost:8001/docs
echo.
echo Press any key to close this window...
pause >nul
