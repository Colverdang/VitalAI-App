# improved_server.py
import http.server
import socketserver
import webbrowser
import os

PORT = 8080

class DashboardHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Redirect root to our dashboard
        if self.path == '/' or self.path == '':
            self.path = '/direct_dashboard.html'
        return super().do_GET()

print("Starting VitalAI Dashboard Server on port", PORT)
print("Serving from:", os.getcwd())
print("Open your browser to: http://localhost:8080")
print("Dashboard will load automatically")
print("Press Ctrl+C to stop")

# Open browser
webbrowser.open('http://localhost:8080')

# Start server
with socketserver.TCPServer(("", PORT), DashboardHandler) as httpd:
    httpd.serve_forever()
