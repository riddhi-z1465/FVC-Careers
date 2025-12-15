#!/usr/bin/env python3
"""
Simple HTTP Server for FVC Careers
Run this to serve the website locally and avoid CORS issues
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Add Cache-Control headers to prevent caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        
        super().end_headers()

def start_server():
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ FVC Careers Server Started!")
        print(f"🌐 Server running at: http://localhost:{PORT}")
        print(f"📂 Serving files from: {os.getcwd()}")
        print(f"\n📄 Open these URLs in your browser:")
        print(f"   - Main Site: http://localhost:{PORT}/index.html")
        print(f"   - Jobs: http://localhost:{PORT}/career/jobs.html")
        print(f"   - Apply: http://localhost:{PORT}/career/apply.html")
        print(f"   - HR Login: http://localhost:{PORT}/hr/hr-login.html")
        print(f"\n❌ Press Ctrl+C to stop the server\n")
        
        # Open browser
        webbrowser.open(f'http://localhost:{PORT}/index.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server stopped")
            httpd.shutdown()

if __name__ == "__main__":
    start_server()
