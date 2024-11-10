import { EzFlags, uint8, notImplemented, PacketResponse } from "../EzTypes";
import { malformed } from "../EzTypes";

export const handleLocation = (flag: uint8, msg: Buffer): PacketResponse => {
	const location = EzFlags.LOCATION;
	const length = msg.length;

	switch (flag) {
		case location.POSITION		: return handlePositionChange(msg);
		case location.TERRITORY	: return handleLocationChange(msg, length, EzFlags.LOCATION.TERRITORY);
		case location.ROTATION		: return handleLocationChange(msg, length, EzFlags.LOCATION.ROTATION);
		case location.SUB_AREA		: return handleLocationChange(msg, length, EzFlags.LOCATION.SUB_AREA);
		case location.REGION			: return handleLocationChange(msg, length, EzFlags.LOCATION.REGION);
		case location.AREA				: return handleLocationChange(msg, length, EzFlags.LOCATION.AREA);
	}

	return notImplemented();
};

export const handlePositionChange = (msg: Buffer): PacketResponse => {
	return {
		status: EzFlags.RESPONSE.OK,
		data: {
			x: msg.subarray(1, 5).readFloatLE(0),
			y: msg.subarray(5, 9).readFloatLE(0),
		}
	};
};

export const handleLocationChange = (msg: Buffer, actualSize: number, expectedSize: number): PacketResponse => {
	if (actualSize !== expectedSize) {
		return malformed();
	}

	return {
		status: EzFlags.RESPONSE.OK,
		data: msg.subarray(1, expectedSize).readInt8(0)
	};
};