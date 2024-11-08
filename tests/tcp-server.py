import socket
import time
import random
import threading
import json
import re

def get_random_job_data():
	return {
		"level": random.randint(1, 90),
		"jobName": "Conjurer",
		"currentXP": random.randint(1, 52350),
		"maxXP": random.randint(52350, 82350),
	}

def get_random_location():
	n = random.randint(1, 9)
	return {
		"territory": f"territory{n}",
		"area": f"area{n}",
		"subarea": f"subarea{n}",
	}

def is_uuid(s):
	return re.match(r'^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$', s)

def handle_packet(client_socket, packet):
	idx = 0
	while len(packet) > 0:
		ez = packet[0]
		packet = packet[1:]

		payload_length = int.from_bytes(packet[0:2], byteorder='big')
		packet = packet[2:]

		uuid = packet[0:8].decode('utf-8')
		packet = packet[8:]

		message = packet[0:payload_length].decode("utf-8")
		packet = packet[payload_length:]

		recv_data(client_socket, uuid, message)

		print(f"{idx+1})", ez, payload_length, uuid, f"'{message}'")

		packet = packet[1:]
		idx += 1

	# print(packet)

	return None

def recv_data(client_socket, uuid, message):
	out_data = bytearray([0x1D])

	message = ""
	message_length = 0x00

	if(message == 'get-main-job-info'):
		message = json.dumps(get_random_job_data())
	elif(message == 'get-location'):
		message = json.dumps(get_random_location())

	message_length = len(message).to_bytes(2, byteorder='big')
	out_data.extend(message_length)
	out_data.extend(uuid.encode("utf-8"))
	out_data.extend(message.encode('utf-8'))
	out_data.append(0x1D)

	client_socket.send(out_data)

def setup_tcp_server():
	server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	server_socket.bind(('0.0.0.0', 58008))
	server_socket.listen(0)
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

			# print(f"Received from client:\n{decoded}")

			handle_packet(client_socket, data)

			# id = decoded.split("\n")[0]
			# command = decoded.split("\n")[1]
			# payload = "\n".join(decoded.split("\n")[3:])

			# data_str = ""
			# if is_uuid(id):
			# 	data_str += f"{id}\n"

			# if(command == 'get-main-job-info'):
			# 	data_str += json.dumps(get_random_job_data())
			# 	client_socket.send(data_str.encode())
			# 	print(f"Sent to client:\n{data_str}")
			# elif(command == 'get-location'):
			# 	data_str += json.dumps(get_random_location())
			# 	client_socket.send(data_str.encode())
			# 	print(f"Sent to client:\n{data_str}")
			# else:
			# 	client_socket.send(f"Unknown command: {decoded}".encode())

def run_server():
	server_thread = threading.Thread(target=setup_tcp_server)
	server_thread.daemon = True
	server_thread.start()

	while True:
		cmd = input("Enter 'q' to stop the server: ")
		if cmd.lower() == 'q':
			break

run_server()
