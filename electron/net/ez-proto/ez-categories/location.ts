import { EZ, int8, notImplemented, PacketResponse } from "../structs";
import { malformed } from "../structs";

export const handleLocation = (flag: int8, msg: Buffer): PacketResponse => {
	const location = EZ.LOCATION;
	const length = msg.length;

	switch (flag) {
		case location.POSITION.flag: 	return handlePositionChange(msg, length);
		case location.TERRITORY.flag: return handleLocationChange(msg, length, EZ.LOCATION.TERRITORY.lenB);
		case location.ROTATION.flag: 	return handleLocationChange(msg, length, EZ.LOCATION.ROTATION.lenB);
		case location.SUB_AREA.flag: 	return handleLocationChange(msg, length, EZ.LOCATION.SUB_AREA.lenB);
		case location.REGION.flag: 		return handleLocationChange(msg, length, EZ.LOCATION.REGION.lenB);
		case location.AREA.flag: 			return handleLocationChange(msg, length, EZ.LOCATION.AREA.lenB);
	}

	return notImplemented();
};

export const handlePositionChange = (msg: Buffer, size: number): PacketResponse => {
	if (size !== EZ.LOCATION.POSITION.lenB) {
		return malformed();
	}

	return {
		status: EZ.RESPONSE.OK,
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
		status: EZ.RESPONSE.OK,
		data: msg.subarray(1, expectedSize).readInt8(0)
	};
};