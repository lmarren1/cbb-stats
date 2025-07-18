from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class PythonHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'OK')
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/analyze':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data)
                print("Received:", data)

                # Simulated analysis
                result = {
                    "suggestion": f"Substitute player {data['player']} more often in high tempo situations.",
                    "efficiency": 1.14
                }

                response = json.dumps(result).encode('utf-8')
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(response)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Error: {str(e)}".encode('utf-8'))

def run():
    server_address = ('localhost', 5000)
    httpd = HTTPServer(server_address, PythonHandler)
    print("Python microservice running on port 5000")
    httpd.serve_forever()

if __name__ == '__main__':
    run()

game_half = 0
off_team_id = 2
def_team_id = 1
for possession_number in range(1, 141):
    if possession_number > 66:
        game_half = 2
    else:
        game_half = 1
    if possession_number % 2 == 0:
        off_team_id = 1
        def_team_id = 2
    else:
        off_team_id = 2
        def_team_id = 1
    print(f"(1, {game_half}, {possession_number}, {off_team_id}, {def_team_id}, '00::', '00::', , , ),")
