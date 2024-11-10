EZ_FLAGS = {
	'EZ': 0x1E,  # Example value, replace with actual
	'LOCATION': {'ALL': {'flag': 0x17}},  # Example value, replace with actual
	'JOB': {'MAIN': {'flag': 0x21}}  # Example value, replace with actual
}

def deserialize(msg: bytes):
	# if len(msg) < 17:
	# 	raise ValueError("Malformed packet - too short")

	short1 = (msg[0] << 8) | msg[1]
	if ((short1 >> 10) & 0x3F) != EZ_FLAGS['EZ']:
		raise ValueError("Malformed packet - identifier missing from packet")

	packet_length = short1 & 0x3FF

	short2 = (msg[2] << 8) | msg[3]
	id = (short2 >> 6) & 0x3FF
	flag = short2 & 0x3F

	payload = msg[4:packet_length-2]

	try:
		decoded_payload = payload.decode("utf-8")
	except:
		decoded_payload = ""

	return {
		'id': id,
		'flag': flag,
		'payload': decoded_payload
	}

def serialize(route_flag: int, data: bytes, id: int = 0) -> bytes:
	b_header = EZ_FLAGS['EZ']

	b_id = id & 0x3FF
	b_payload = truncate_1024b(as_utf8(data))
	b_packet_length = (0x24 + len(b_payload)) & 0x3FF

	control_header = bytearray(4)
	short = ((b_header << 10) | b_packet_length) & 0xFFFF
	control_header[0] = (short >> 8) & 0xFF
	control_header[1] = short & 0xFF

	short = (b_id << 6 | route_flag) & 0xFFFF
	control_header[2] = (short >> 8) & 0xFF
	control_header[3] = short & 0xFF

	return bytes(control_header) + b_payload

def as_utf8(data: bytes) -> str:
	return data.decode('utf-8')

def get_route_flag(route_flag: int) -> str:
	if route_flag == EZ_FLAGS['LOCATION']['ALL']['flag']:
		return "get-location-all"
	elif route_flag == EZ_FLAGS['JOB']['MAIN']['flag']:
		return "get-job-info-main"
	return None

def truncate_1024b(data: str) -> bytes:
	data = data[:1024]
	return data.encode('utf-8')
