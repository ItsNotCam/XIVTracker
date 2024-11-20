// Positional data 0x01 -> 0x0F

type uint16 = number;
type uint10 = number;
type uint8 = number;
type uint6 = number;

interface PacketResponse {
	status: uint8;
	data: any | null;
}

interface DeserializedPacket {
	id: uint10;
	flag: uint6;
	payload: Buffer;
}
