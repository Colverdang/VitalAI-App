# minimal_server.py
import http.server
import socketserver
import os

PORT = 8080

# Create a basic HTML page if it doesn't exist
html_content = '''
<!DOCTYPE html>
<html>
<head>
    <title>VitalAI Dashboard</title>
    <style>
        body { font-family: Arial; margin: 40px; }
        .card { background: #4CAF50; color: white; padding: 20px; margin: 10px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>🚀 VitalAI Analytics Dashboard</h1>
    <p>Your dashboard is working!</p>
    
    <div class="card">
        <h3>Total Patients</h3>
        <div id="patients">15</div>
    </div>
    
    <div class="card" style="background: #2196F3;">
        <h3>Total Chats</h3>
        <div id="chats">42</div>
    </div>
    
    <p><strong>Next:</strong> Connect to your analytics data</p>
</body>
</html>
'''

# Write the HTML file
with open('minimal_dashboard.html', 'w') as f:
    f.write(html_content)

print(f"✅ Starting server on http://localhost:{PORT}")
print("📁 Serving from:", os.getcwd())
print("🌐 Open your browser to: http://localhost:8080")
print("🛑 Press Ctrl+C to stop")

# Start the server
with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
