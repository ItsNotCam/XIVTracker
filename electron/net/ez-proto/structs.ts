// Positional data 0x01 -> 0x0F

export type int8 = number;

export interface PacketResponse {
	status: int8;
	data: any | null;
}

export const EZ = {
	RESPONSE: {
		OK								: 0x00,
		MALFORMED					: 0x01,
		NOT_IMPLEMENTED		: 0x02,
		NOT_FOUND					: 0x03,
		INTERNAL_ERROR		: 0x04,
		NOT_AVAILABLE			: 0x05,
		TOO_MANY_REQUESTS	: 0x06,
	},
	LOCATION: {
		FIRST 		: { flag: 0x00, lenB: 0x00 },
		POSITION 	: { flag: 0x01, lenB: 0x09 },
		ROTATION 	: { flag: 0x02, lenB: 0x05 },
		AREA 			: { flag: 0x03, lenB: 0x03 },
		TERRITORY : { flag: 0x04, lenB: 0x03 },
		REGION 		: { flag: 0x05, lenB: 0x03 },
		SUB_AREA 	: { flag: 0x06, lenB: 0x03 },
		RESERVED1 : { flag: 0x07, lenB: 0x00 },
		RESERVED2 : { flag: 0x08, lenB: 0x00 },
		RESERVED3 : { flag: 0x09, lenB: 0x00 },
		RESERVED4 : { flag: 0x0A, lenB: 0x00 },
		RESERVED5 : { flag: 0x0B, lenB: 0x00 },
		RESERVED6 : { flag: 0x0C, lenB: 0x00 },
		RESERVED7 : { flag: 0x0D, lenB: 0x00 },
		RESERVED8 : { flag: 0x0E, lenB: 0x00 },
		LAST 			: { flag: 0x0F, lenB: 0x00 },
	},
}

export const isLocation = (flag: number): boolean => {
	return flag >= EZ.LOCATION.FIRST.flag && flag <= EZ.LOCATION.LAST.flag;
};

export const malformed = (): PacketResponse => ({
	status: EZ.RESPONSE.MALFORMED,
	data: null
});

export const notImplemented = (): PacketResponse => ({
	status: EZ.RESPONSE.NOT_IMPLEMENTED,
	data: null
});
