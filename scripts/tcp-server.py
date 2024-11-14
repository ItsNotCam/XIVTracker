import socket
import time
import random
import threading
import json
import re
import math
from ez_serde_v2 import deserialize, serialize

def get_random_job_data():
	ffxiv_jobs = [
    # Combat Jobs
    "paladin",
    "warrior",
    "dark knight",
    "gunbreaker",
    "white mage",
    "scholar",
    "astrologian",
    "sage",
    "monk",
    "dragoon",
    "ninja",
    "samurai",
    "reaper",
    "bard",
    "machinist",
    "dancer",
    "black mage",
    "summoner",
    "red mage",
    "blue mage",
    
    # Gathering Jobs
    "miner",
    "botanist",
    "fisher",
    
    # Crafting Jobs
    "carpenter",
    "blacksmith",
    "armorer",
    "goldsmith",
    "leatherworker",
    "weaver",
    "alchemist",
    "culinarian"
	]

	
	max_xp = random.randint(52350, 82350)
	current_xp = random.randint(0, max_xp)

	return {
		"level": random.randint(1, 90),
		"job_name": random.choice(ffxiv_jobs),
		"current_xp": current_xp,
		"max_xp": max_xp,
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
	print(packet.decode('utf-8'))
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

def recv_data(client_socket, uuid, message):
	out_data = bytearray([0x1D])

	msg = ""
	message_length = 0x00

	if(message == 'get-main-job-info'):
		msg = json.dumps(get_random_job_data())
	elif(message == 'get-location'):
		msg = json.dumps(get_random_location())

	message_length = len(msg).to_bytes(2, byteorder='big')
	out_data.extend(message_length)
	out_data.extend(uuid.encode("utf-8"))
	out_data.extend(msg.encode('utf-8'))

	# msg_encoded = message.encode("utf-8")
	# out_data.extend(message.encode('utf-8'))

	print(out_data.decode('utf-8'))
	client_socket.send_all(out_data)
	client_socket.flush()

def setup_tcp_server():
	server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
	server_socket.bind(('0.0.0.0', 58008))
	server_socket.listen(0)
	print("Server listening on port 50085")

	while True:
		client_socket, addr = server_socket.accept()
		client_socket.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)
		print(f"Connection from {addr}")
		# client_socket.send(b"Hello from server!")
		
		while True:
			try:
				data = client_socket.recv(1024)
				if not data:
					break
			except ConnectionResetError:
				print(f"Connection from {addr} closed")
				break

			# print(f"Received from client:\n{decoded}")

			try:
				packet = deserialize(data)
				# print(json.dumps(packet, indent=2))
			
				flag = packet["flag"]
				payload = packet["payload"]
				if flag == 2:
					utf8_msg = payload.encode("utf-8")
					print("sending:", utf8_msg)
					msg = serialize(0x02, utf8_msg, packet["id"])

					client_socket.sendall(msg)

					# end_0 = math.ceil(len(msg) / 2 + 1) // 2
					# client_socket.sendall(msg[0:end_0])
					# print("sent 1")
					# client_socket.sendall(msg[end_0:])
					# print("sent 2")
				elif flag == 0x21:
					utf8_msg = json.dumps(get_random_job_data()).encode("utf-8")
					print("sending:", utf8_msg)
					msg = serialize(0x21, utf8_msg, packet["id"])

					client_socket.sendall(msg)

					# end_0 = math.ceil(len(msg) / 2 + 1) // 2
					# client_socket.sendall(msg[0:end_0])
					# print("sent 1")
					# client_socket.sendall(msg[end_0:])
					# print("sent 2")

				# handle_packet(client_socket, packet)
			except Exception as e:
				print(f"Failed to deserialize packet: {e}")

			# handle_packet(client_socket, data)

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
