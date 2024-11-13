import { EzDecode, EzEncode } from "./EzEncoder";
import { 
	DeserializedPacket, 
	EzFlag, 
	uint10, 
} from "./EzTypes";

export const deserialize = (msg: Buffer): DeserializedPacket => {
	// these primitive types are just sugar.
	let packetLength: uint10;
	let id: uint10;
	let flag: EzFlag;
	let payload: Buffer;

	{
		// get the first 16 bits
		const short = (msg[0] << 8) | msg[1];

		// if the first 6 bits are not equal to our fixed length packet header, error
		if(((short >> 10) & 0x3F) !== EzFlag.EZ) {
			throw new Error("Malformed packet");
		}

		// packet length is the last 10 bits = 0011 1111 1111 = 0x3FF
		packetLength 	= (short & 0x3FF); 
	}

	{
		const short = (msg[2] << 8) | msg[3];
		id = (short >> 6) & 0x3FF;
		flag = short & 0x3F;
	}

	payload = msg.subarray(4,packetLength-2);

	let decodedPayload = EzDecode(payload);
	console.log("received:", id, flag, decodedPayload)

	if(decodedPayload[decodedPayload.length-1] !== "}") {
		decodedPayload = decodedPayload.substring(0,decodedPayload.length) + "}";
	}

	return {
		id: id,
		flag: flag,
		payload: Buffer.from(decodedPayload)
	};
}

// Build an EzPacket.
// Visual: https://lucid.app/lucidchart/b06bf1e5-8ae7-4e1b-8f32-f256003140d0/edit?invitationId=inv_2a212140-1bee-41d0-913d-4ef4706ba6b1&page=m2MpGyAuT.V7#
export const serialize = (routeFlag: EzFlag, data: Buffer, id: uint10 = 0): Buffer => {
	const bHeader 			= EzFlag.EZ;												// 6b 		- Fixed header "ez" where: bHeader === alphabet.indexOf("e") + alphabet.indexOf("z")
	const bId 					= id & 0x3FF; 											// 10b 		- ID
	const bPayload 			= truncate1024B(asUtf8(data));			// 1024B 	- Payload truncated to 1024 bytes
	const bPacketLength	= (0x24 + bPayload.length) & 0x3FF; // 10b 		- Packet length

	let controlHeader: Uint8Array = new Uint8Array(4);
	{
		// header shifted 10 bits to make room for 10 bit packet length & with 0xFFFF to ensure 16 bits
		const short = ((bHeader << 10) | bPacketLength) & 0xFFFF;
		controlHeader[0] = (short >> 8) & 0xFF;
		controlHeader[1] = short & 0xFF;
	}

	{
		// id shifted 6 bits to make room for the 6 bit flag & with 0xFFFF to ensure 16 bits
		const short = (bId << 6 | routeFlag) & 0xFFFF;
		controlHeader[2] = (short >> 8) & 0xFF;
		controlHeader[3] = short & 0xFF;
	}

	const encodedPayload = EzEncode(asUtf8(data));
	return Buffer.from([...controlHeader, ...encodedPayload]);
};

export const asUtf8 = (data: Buffer): string => {
	return data.toString("utf-8");
}

export const truncate1024B = (data: string): Buffer => {
	data = data.substring(0, 1024);
	return Buffer.from(data);
};

const EzSerDe = {
	deserialize: deserialize,
	serialize: serialize
};

export default EzSerDe;
