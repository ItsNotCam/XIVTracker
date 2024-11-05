import socket
import time
import random

def send_random_number():
	server_address = ('localhost', 27001)
	sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

	try:
		while True:
			random_number = random.randint(0, 999)
			message = str(random_number).encode('utf-8')
			sock.sendto(message, server_address)
			print(f"Sent: {random_number}")
			time.sleep(2)
	finally:
		sock.close()

# if __name__ == "__main__":
	# send_random_number()


import socket

def start_tcp_server():
    server_address = ('localhost', 58008)
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server_sock:
        server_sock.bind(server_address)
        server_sock.listen(1)
        print("Server is listening on port 42069...")

        while True:
            client_sock, client_address = server_sock.accept()
            with client_sock:
                print(f"Connected by {client_address}")
                data = client_sock.recv(1024)
                if data:
                    print("Received:", data)
                    client_sock.sendall(b"Hello, client!")

if __name__ == "__main__":
    start_tcp_server()