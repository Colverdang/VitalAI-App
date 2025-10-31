# Start-Analytics.ps1
Write-Host "🚀 Starting VitalAI Analytics System..." -ForegroundColor Green
Write-Host ""

# Start Dashboard Server
Write-Host "📊 Starting Dashboard Server..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "dashboard_server.py"

# Wait a bit
Start-Sleep -Seconds 3

# Start FastAPI Server  
Write-Host "🏥 Starting FastAPI Server..." -ForegroundColor Yellow
Start-Process -NoNewWindow -FilePath "python" -ArgumentList "data-engineer\mysql_fastapi.py"

Write-Host ""
Write-Host "✅ Both servers are starting..." -ForegroundColor Green
Write-Host "📊 Dashboard: http://localhost:8080" -ForegroundColor Cyan
Write-Host "🔧 API Docs: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏳ Waiting for servers to initialize..." -ForegroundColor Yellow
Write-Host "🌐 Your browser should open automatically to the dashboard" -ForegroundColor White
Write-Host ""
Write-Host "🛑 To stop servers: Close the terminal windows" -ForegroundColor Red

# Wait for user input
Write-Host ""
Read-Host "Press Enter to close this window"
