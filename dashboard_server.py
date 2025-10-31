import http.server
import socketserver
import json
import webbrowser
import os
from datetime import datetime

PORT = 8080

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve dashboard.html for root path
        if self.path == '/' or self.path == '':
            self.path = '/dashboard.html'
        
        # Handle API requests
        if self.path == '/api/analytics':
            self.serve_analytics()
            return
            
        # Serve static files
        return super().do_GET()
    
    def serve_analytics(self):
        try:
            # Try to load analytics data
            if os.path.exists('local_analytics.json'):
                with open('local_analytics.json', 'r') as f:
                    analytics_data = json.load(f)
            else:
                # Create sample data if file doesn't exist
                analytics_data = {
                    'patients_created': [],
                    'chat_sessions': []
                }
            
            # Create summary
            today = datetime.now().strftime('%Y-%m-%d')
            patients_today = len([
                p for p in analytics_data.get('patients_created', []) 
                if p.get('timestamp', '').startswith(today)
            ])
            
            summary = {
                'total_patients': len(analytics_data.get('patients_created', [])),
                'total_chats': len(analytics_data.get('chat_sessions', [])),
                'patients_created_today': patients_today,
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

def start_server():
    print(f"🚀 Starting Dashboard Server on port {PORT}")
    print(f"📊 Serving from directory: {os.getcwd()}")
    
    # Change to the script directory to serve files from there
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Create sample analytics file if it doesn't exist
    if not os.path.exists('local_analytics.json'):
        sample_data = {
            "patients_created": [
                {
                    "patient_id": 1,
                    "first_name": "Sample",
                    "last_name": "Patient", 
                    "age": 30,
                    "gender": "Female",
                    "timestamp": datetime.now().isoformat()
                }
            ],
            "chat_sessions": [
                {
                    "session_id": 1,
                    "patient_id": 1,
                    "topic": "General Consultation",
                    "timestamp": datetime.now().isoformat()
                }
            ]
        }
        with open('local_analytics.json', 'w') as f:
            json.dump(sample_data, f, indent=2)
    
    # Open browser
    print("🌐 Opening dashboard in browser...")
    webbrowser.open(f'http://localhost:{PORT}')
    
    # Start server
    with socketserver.TCPServer(("", PORT), DashboardHandler) as httpd:
        print(f"✅ Dashboard ready: http://localhost:{PORT}")
        print("🛑 Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    start_server()
