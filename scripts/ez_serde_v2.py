EZ_FLAGS = {
	'EZ': 0x1D,  # Example value, replace with actual
	'LOCATION': {'ALL': {'flag': 0x17}},  # Example value, replace with actual
	'JOB': {'MAIN': {'flag': 0x21}}  # Example value, replace with actual
}

# Example usage
EzEncoding = {
    "NUL": 0x00, " ": 0x01, "!": 0x02, "\"": 0x03, "#": 0x04, "$": 0x05, "%": 0x06, "&": 0x07,
    "'": 0x08, "(": 0x09, ")": 0x0A, "*": 0x0B, "+": 0x0C, ",": 0x0D, "-": 0x0E, ".": 0x0F,
    "/": 0x10, "0": 0x11, "1": 0x12, "2": 0x13, "3": 0x14, "4": 0x15, "5": 0x16, "6": 0x17,
    "7": 0x18, "8": 0x19, "9": 0x1A, ":": 0x1B, "<": 0x1C, "=": 0x1D, ">": 0x1E, "?": 0x1F,
    "@": 0x20, "[": 0x21, "]": 0x22, "{": 0x23, "}": 0x24, "_": 0x25, "a": 0x26, "b": 0x27,
    "c": 0x28, "d": 0x29, "e": 0x2A, "f": 0x2B, "g": 0x2C, "h": 0x2D, "i": 0x2E, "j": 0x2F,
    "k": 0x30, "l": 0x31, "m": 0x32, "n": 0x33, "o": 0x34, "p": 0x35, "q": 0x36, "r": 0x37,
    "s": 0x38, "t": 0x39, "u": 0x3A, "v": 0x3B, "w": 0x3C, "x": 0x3D, "y": 0x3E, "z": 0x3F
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

	# try:
	# 	decoded_payload = payload.decode("utf-8")
	# except:
	# 	decoded_payload = ""
      
	return {
		'id': id,
		'flag': flag,
		'payload': ezDecode(payload)
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

	return bytes(control_header) + bytes(ezEncode(b_payload.decode("utf-8")))

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

def ezDecode(input_data):
    # Reverse the EzEncoding map to decode the 6-bit values back to characters
    reverse_encoding = {v: k for k, v in EzEncoding.items()}
    
    # This will store the decoded characters
    decoded_data = []
    
    # Temporary container for 6-bit values as we extract them from input_data
    word = 0
    bitsUsed = 0
    
    for byte in input_data:
        # Shift the current word by 8 bits to the left to make room for the new byte
        word = (word << 8) | byte
        bitsUsed += 8
        
        # Extract the 6-bit values from the word as long as we have at least 6 bits
        while bitsUsed >= 6:
            # Extract the top 6 bits of the word
            encoded = (word >> (bitsUsed - 6)) & 0x3F  # Mask with 0x3F to get the lowest 6 bits
            decoded_char = reverse_encoding.get(encoded)
            
            if decoded_char is not None:
                decoded_data.append(decoded_char)
            else:
                raise ValueError(f"Decoded value {encoded} not found in reverse encoding map.")
            
            # Decrease bitsUsed by 6 as we consumed 6 bits
            bitsUsed -= 6
    
    return ''.join(decoded_data)

# Example encoded data (this would be the output of your encoding process)
# encoded_data = [0xfb, 0x4e, 0x81, 0xe3, 0x1a, 0xaa, 0xd5, 0xf0]  # These bytes represent the 6-bit encoded data

# # Decode the data
# decoded_string = decode(encoded_data, EzEncoding)
# print("Decoded String:", decoded_string)

def ezEncode(input_string):
    # Reverse the EzEncoding map for fast lookup of 6-bit value
    encoding_map = EzEncoding
    
    # This will store the packed bytes
    encoded_data = []
    
    word = 0
    bitsUsed = 0
    for char in input_string:
        # Get the 6-bit encoded value for the current character
        encoded_value = encoding_map.get(char)
        
        if encoded_value is None:
            raise ValueError(f"Character '{char}' not found in encoding map.")
        
        # Pack the 6-bit value into the word by shifting it into the correct position
        word = (word << 6) | encoded_value
        bitsUsed += 6
        
        # When we have at least 8 bits in the word, store a byte
        while bitsUsed >= 8:
            # Extract the top 8 bits
            byte = (word >> (bitsUsed - 8)) & 0xFF
            encoded_data.append(byte)
            bitsUsed -= 8
    
    # If there are leftover bits (less than 8), we need to handle the remaining bits
    if bitsUsed > 0:
        # Shift the remaining bits and store the final byte
        byte = (word << (8 - bitsUsed)) & 0xFF
        encoded_data.append(byte)
    
    return encoded_data
