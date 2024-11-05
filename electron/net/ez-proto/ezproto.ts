import { int8, isLocation, notImplemented, PacketResponse } from "./structs";
import { handleLocation } from "./ez-categories/location";

// just so i know what its meant to be
export const ezDeserialize = (msg: Buffer, size: number): PacketResponse => {
	const flag: int8 = msg.subarray(0, 1).readInt8();

	if(isLocation(flag)) {
		return handleLocation(flag, msg);
	}

	return notImplemented();
}

export const ezSerialize = (msg: any): Buffer => {
	return Buffer.concat([]);
}

