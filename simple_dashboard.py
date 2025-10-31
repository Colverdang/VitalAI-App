# simple_dashboard.py
import http.server
import socketserver
import webbrowser
import os

PORT = 8080

print("Starting VitalAI Dashboard Server on port", PORT)
print("Serving from:", os.getcwd())
print("Open your browser to: http://localhost:8080")
print("Press Ctrl+C to stop")

# Open browser
webbrowser.open('http://localhost:8080')

# Start server
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
