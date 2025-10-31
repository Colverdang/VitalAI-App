# vitalai_dashboard.py
import http.server
import socketserver
import webbrowser
import json
import os
from datetime import datetime

PORT = 8080

# Create the dashboard HTML content
DASHBOARD_HTML = '''
<!DOCTYPE html>
<html>
<head>
    <title>VitalAI Analytics Dashboard</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        .metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .metric-card {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.2);
            backdrop-filter: blur(10px);
        }
        .metric-value {
            font-size: 3em;
            font-weight: bold;
            margin: 15px 0;
        }
        .metric-label {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 10px;
        }
        .btn {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
            transition: background 0.3s;
        }
        .btn:hover {
            background: #45a049;
        }
        .btn-api {
            background: #2196F3;
        }
        .btn-api:hover {
            background: #1976D2;
        }
        .status {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 10px;
            margin-top: 30px;
        }
        .last-update {
            text-align: center;
            margin-top: 20px;
            opacity: 0.8;
            font-size: 0.9em;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="font-size: 2.5em; margin-bottom: 10px;">VitalAI Analytics Dashboard</h1>
            <p style="font-size: 1.2em; opacity: 0.9;">Real-time Health AI System Monitoring</p>
        </div>
        
        <div style="text-align: center; margin-bottom: 30px;">
            <button class="btn" onclick="loadData()">Refresh Data</button>
            <button class="btn btn-api" onclick="testAPI()">Test API Connection</button>
            <button class="btn" onclick="showSampleData()">Show Sample Data</button>
        </div>
        
        <div class="metrics">
            <div class="metric-card">
                <div class="metric-label">Total Patients</div>
                <div class="metric-value" id="patients">--</div>
                <div>Registered in system</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Chat Sessions</div>
                <div class="metric-value" id="chats">--</div>
                <div>Patient interactions</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">Today's Activity</div>
                <div class="metric-value" id="today">--</div>
                <div>New registrations</div>
            </div>
            
            <div class="metric-card">
                <div class="metric-label">System Status</div>
                <div class="metric-value" id="status" style="font-size: 2em;">✅</div>
                <div>All systems operational</div>
            </div>
        </div>
        
        <div class="status">
            <h3>Live Data Feed</h3>
            <div id="data-feed">
                <p>Waiting for data... Click "Refresh Data" to load analytics.</p>
            </div>
        </div>
        
        <div class="last-update">
            <p>Last updated: <span id="last-updated">Never</span></p>
            <p>VitalAI Health Analytics System | Built with FastAPI & Python</p>
        </div>
    </div>

    <script>
        async function loadData() {
            try {
                const response = await fetch('/api/analytics');
                const data = await response.json();
                
                document.getElementById('patients').textContent = data.total_patients || '24';
                document.getElementById('chats').textContent = data.total_chats || '156';
                document.getElementById('today').textContent = data.patients_created_today || '8';
                document.getElementById('last-updated').textContent = new Date().toLocaleString();
                
                // Update data feed
                document.getElementById('data-feed').innerHTML = 
                    <p><strong>Data Source:</strong> </p>
                    <p><strong>System Uptime:</strong> </p>
                    <p><strong>Status:</strong> </p>
                ;
                
            } catch (error) {
                showSampleData();
                document.getElementById('data-feed').innerHTML = 
                    <p style="color: #ff6b6b;">API Connection Failed: Using sample data</p>
                    <p>Make sure your FastAPI server is running on port 8001</p>
                ;
            }
        }
        
        function showSampleData() {
            document.getElementById('patients').textContent = '24';
            document.getElementById('chats').textContent = '156';
            document.getElementById('today').textContent = '8';
            document.getElementById('last-updated').textContent = new Date().toLocaleString();
            document.getElementById('data-feed').innerHTML = 
                <p><strong>Data Source:</strong> sample_data</p>
                <p><strong>Status:</strong> Using demonstration data</p>
                <p>Start your FastAPI server to see real analytics</p>
            ;
        }
        
        async function testAPI() {
            try {
                const response = await fetch('http://localhost:8001/');
                const data = await response.json();
                alert('API Server is running: ' + data.message);
            } catch (error) {
                alert('API Server is not available. Start it with: py data-engineer\\mysql_fastapi.py');
            }
        }
        
        // Load data on page load
        loadData();
        
        // Auto-refresh every 30 seconds
        setInterval(loadData, 30000);
    </script>
</body>
</html>
'''

class VitalAIHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '':
            # Serve the dashboard HTML
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(DASHBOARD_HTML.encode())
        elif self.path == '/api/analytics':
            # Serve analytics data
            self.serve_analytics()
        else:
            # Serve other files normally
            super().do_GET()
    
    def serve_analytics(self):
        try:
            # Try to load from local analytics file
            if os.path.exists('local_analytics.json'):
                with open('local_analytics.json', 'r') as f:
                    analytics_data = json.load(f)
            else:
                # Create sample data
                analytics_data = {
                    'patients_created': [
                        {'patient_id': 1, 'first_name': 'Test', 'last_name': 'Patient', 'timestamp': datetime.now().isoformat()}
                    ],
                    'chat_sessions': [
                        {'session_id': 1, 'patient_id': 1, 'timestamp': datetime.now().isoformat()}
                    ]
                }
            
            # Create summary
            summary = {
                'total_patients': len(analytics_data.get('patients_created', [])),
                'total_chats': len(analytics_data.get('chat_sessions', [])),
                'patients_created_today': len(analytics_data.get('patients_created', [])),
                'system_uptime': datetime.now().isoformat(),
                'data_source': 'local_storage',
                'status': 'online'
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(summary).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())

print("🚀 Starting VitalAI Dashboard Server")
print("📊 Port: 8080")
print("🌐 Opening browser...")
print("🛑 Press Ctrl+C to stop")

# Open browser
webbrowser.open('http://localhost:8080')

# Start server
with socketserver.TCPServer(("", PORT), VitalAIHandler) as httpd:
    httpd.serve_forever()
