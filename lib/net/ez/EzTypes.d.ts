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

export enum EzFlag {
	NULL = 0x01,
	HEARTBEAT = 0x02,
	EZ = 0x1D,
	OK = 0x03,
	MALFORMED = 0x04,
	NOT_IMPLEMENTED = 0x05,
	NOT_FOUND = 0x06,
	INTERNAL_ERROR = 0x07,
	NOT_AVAILABLE = 0x08,
	TOO_MANY_REQUESTS = 0x09,
	LOCATION_ALL = 0x10,
	LOCATION_POSITION = 0x11,
	LOCATION_ROTATION = 0x12,
	LOCATION_AREA = 0x13,
	LOCATION_TERRITORY = 0x14,
	LOCATION_REGION = 0x15,
	LOCATION_SUB_AREA = 0x16,
	LOCATION_RESERVED1 = 0x17,
	LOCATION_RESERVED2 = 0x18,
	LOCATION_RESERVED3 = 0x19,
	LOCATION_RESERVED4 = 0x1A,
	LOCATION_RESERVED5 = 0x1B,
	LOCATION_RESERVED6 = 0x1C,
	LOCATION_RESERVED7 = 0x1D,
	LOCATION_LAST = 0x1F,
	JOB_ALL = 0x20,
	JOB_MAIN = 0x21
}


/**
 * Represents an error that occurs when an EzPacketStream overflows.
 * 
 * @extends {Error}
 */
export class EzPacketStreamOverflowError extends Error {
	/**
	 * The amount of data that overflowed.
	 * @private
	 */
	private readonly overflowData: number;
	private readonly byteIndxex: number;

	/**
	 * Creates an instance of EzPacketStreamOverflowError.
	 * 
	 * @param {string} message - The error message.
	 * @param {number} overflow - The amount of data that overflowed.
	 */
	constructor(message: string, overflow: number, byteIndex: number) {
		super(message);
		this.overflowData = overflow;
		this.byteIndxex = byteIndex;
		this.name = "EzPacketStreamOverflowError";
	}

	/**
	 * Gets the amount of data that overflowed.
	 * 
	 * @returns {number} The overflowed data.
	 */
	public getOverflow(): number {
		return this.overflowData;
	}

	public getByteIndex(): number {
		return this.byteIndxex;
	}
}
