import { EzFlag, uint10, uint6 } from "./EzTypes.d";

export class EzPacketStream {
	private overflowBuffer: Buffer;
	private buffer: Buffer;
	private offset: number;

	private header: uint6 | null;
	private packetLength: uint10 | null;
	private id: uint10 | null;
	private flag: EzFlag | null;

	constructor() {
		this.overflowBuffer = Buffer.alloc(0);
		this.buffer = Buffer.alloc(0);
		this.offset = 0;

		this.header = null;
		this.packetLength = null;
		this.id = null;
		this.flag = EzFlag.NULL;
	}

	public isFull(): boolean {
		return this.packetLength != null && this.buffer.length >= this.packetLength;
	}

	public append(data: Buffer): boolean {
		if(this.isFull()) {
			throw new Error("PacketStream is full");
		}

		this.buffer = Buffer.concat([this.buffer, data]);

		if(this.buffer.length === 2) {
			const short = (this.buffer[0] << 8) | this.buffer[1];
			this.header = (short >> 10) & 0x3F;
			this.packetLength = short & 0x3FF;
		}

		if(this.buffer.length === 4) {
			const short = (this.buffer[2] << 8) | this.buffer[3];
			this.id = short >> 6;
			this.flag = (short & 0x3F) as EzFlag;
		}

		return this.isFull();
	}

	public flush(): Buffer | null {
		let outData: Buffer | null = this.readBytes(this.packetLength || 0);

		let newBuffer: Buffer = Buffer.alloc(this.buffer.length);
		this.buffer.copy(newBuffer, 0);
		this.reset();
		return newBuffer;
	}

	public readBytes(length: number): Buffer | null {
		if (this.offset + length > this.buffer.length) {
			return null;
		}
		const result = this.buffer.subarray(this.offset, this.offset + length);
		this.offset += length;
		return result;
	}

	public reset(): void {
		this.buffer = Buffer.alloc(0);
		this.offset = 0;
		this.header = null;
		this.packetLength = null;
		this.id = null;
		this.flag = EzFlag.NULL;
	}
}