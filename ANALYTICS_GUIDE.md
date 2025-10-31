# VitalAI Analytics Dashboard - Quick Start Guide

## 🚀 How to Start the Analytics System

### Method 1: One-Click Launcher (Recommended)
1. Double-click: start_analytics.bat
2. Wait for both servers to start
3. Your browser will open automatically to the dashboard

### Method 2: Manual Start
1. Start Dashboard Server:
   \\\ash
   py dashboard_server.py
   \\\

2. Start FastAPI Server (in new terminal):
   \\\ash
   py data-engineer\mysql_fastapi.py
   \\\

3. Open your browser to: http://localhost:8080

## 📊 What You'll See

### Dashboard (http://localhost:8080)
- Real-time patient registration counts
- Chat session analytics
- Today's activity
- System status monitoring
- Auto-refreshes every 30 seconds

### API Documentation (http://localhost:8001/docs)
- Interactive API documentation
- Test endpoints directly
- See all available API methods

## 🔧 System Components

### FastAPI Server (Port 8001)
- Patient registration and management
- Chat session handling
- MySQL database integration
- Analytics tracking

### Dashboard Server (Port 8080)
- Web-based analytics dashboard
- Real-time data visualization
- Local analytics file access

### Analytics Storage
- File: local_analytics.json
- Format: JSON
- Location: Project root folder

## 📈 Tracked Metrics

- Patient registrations (count, demographics)
- Chat sessions (volume, topics)
- System usage patterns
- Daily activity trends

## 🛠️ Troubleshooting

### If dashboard doesn't open:
1. Manually go to: http://localhost:8080
2. Check if servers are running:
   - Dashboard: http://localhost:8080/api/analytics
   - API: http://localhost:8001/

### If ports are busy:
- Change ports in the Python files
- Or stop other applications using ports 8001/8080

## 🎯 Next Steps

1. Start using the system with the one-click launcher
2. Monitor patient registrations in real-time
3. Use the API to build additional features
4. The system works completely offline with local analytics

## 📞 Support

- API Documentation: http://localhost:8001/docs
- Dashboard: http://localhost:8080
- Analytics File: local_analytics.json
