import socket
import time
import random
import threading
import json

def get_random_job_data():
	return {
		"level": random.randint(1, 90),
		"jobName": "Conjurer",
		"currentXP": random.randint(1, 52350),
		"maxXP": random.randint(52350, 82350),
	}


def setup_tcp_server():
	server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	server_socket.bind(('0.0.0.0', 58008))
	server_socket.listen(5)
	print("Server listening on port 50085")

	while True:
		client_socket, addr = server_socket.accept()
		print(f"Connection from {addr}")
		client_socket.send(b"Hello from server!")
		
		while True:
			try:
				data = client_socket.recv(1024)
				if not data:
					break
			except ConnectionResetError:
				print(f"Connection from {addr} closed")
				break

			decoded = data.decode()
			print(f"Received from client: {decoded}")

			if(decoded == 'get-main-job-info'):
				data_str = json.dumps(get_random_job_data())
				client_socket.send(f"get-main-job-info\n{data_str}".encode())
				print(f"Sent to client: {data_str}")
			else:
				client_socket.send(f"Unknown command: {decoded}".encode())

def run_server():
	server_thread = threading.Thread(target=setup_tcp_server)
	server_thread.daemon = True
	server_thread.start()

	while True:
		cmd = input("Enter 'q' to stop the server: ")
		if cmd.lower() == 'q':
			break

run_server()
