// Positional data 0x01 -> 0x0F

export type uint36 = number;
export type uint16 = number;
export type uint10 = number;
export type uint8 = number;
export type uint6 = number;
export interface PacketResponse {
	status: uint8;
	data: any | null;
}

export interface DeserializedPacket {
	id: uint10;
	flag: uint6;
	payload: Buffer;
}

export const EzFlags = {
	NULL: 0x01,
	HEARTBEAT: 0x02,
	EZ: 0x1E,
	RESPONSE: {
		OK								: 0x03,
		MALFORMED					: 0x04,
		NOT_IMPLEMENTED		: 0x05,
		NOT_FOUND					: 0x06,
		INTERNAL_ERROR		: 0x07,
		NOT_AVAILABLE			: 0x08,
		TOO_MANY_REQUESTS	: 0x09,
	},
	LOCATION: {
		ALL 			: 0x10 ,
		POSITION 	: 0x11 ,
		ROTATION 	: 0x12 ,
		AREA 			: 0x13 ,
		TERRITORY : 0x14 ,
		REGION 		: 0x15 ,
		SUB_AREA 	: 0x16 ,
		RESERVED1	: 0x17 ,
		RESERVED2 : 0x18 ,
		RESERVED3 : 0x19 ,
		RESERVED4 : 0x1A ,
		RESERVED5 : 0x1B ,
		RESERVED6 : 0x1C ,
		RESERVED7 : 0x1D ,
		// we skip 0x1E because that is our EZ
		LAST 			: 0x1F ,
	},
	JOB: {
		ALL		: 0x20,
		MAIN	: 0x21,
	}
}
export const isLocation = (flag: number): boolean => {
	return flag >= EzFlags.LOCATION.ALL && flag <= EzFlags.LOCATION.LAST;
};

export const malformed = (): PacketResponse => ({
	status: EzFlags.RESPONSE.MALFORMED,
	data: null
});

export const notImplemented = (): PacketResponse => ({
	status: EzFlags.RESPONSE.NOT_IMPLEMENTED,
	data: null
});
