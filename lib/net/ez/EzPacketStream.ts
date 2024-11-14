import {
	EzFlag,
	uint10
} from "./EzTypes.d";

export class EzPacketStream {
	private buffer: Buffer;

	private packetLength: uint10;
	private id: uint10;
	private flag: EzFlag;

	private currentByte: number;

	constructor() {
		this.buffer = Buffer.alloc(4, 0x00);
		this.packetLength = -1;
		this.id = EzFlag.NULL;
		this.flag = EzFlag.NULL;
		this.currentByte = 0;
	}

	public isFull(): boolean {
		return this.packetLength > 0 && (this.buffer[-1] >> 7 & 0x01) === 0x01;
	}

	public flush(): Buffer | null {
		console.log("flushing", this.buffer);
		let newBuffer: Buffer = Buffer.alloc(this.buffer.length);
		this.buffer.copy(newBuffer, 0);
		this.reset();
		return newBuffer;
	}

	public reset(): void {
		this.buffer = Buffer.alloc(4, 0x00);
		this.id = EzFlag.NULL;
		this.packetLength = -1;
		this.flag = EzFlag.NULL;
		this.currentByte = 0;
	}

	// operate on stream data
	public appendData(data: Buffer): void {
		// iterate through each byte
		for (let byteIdx = 0; byteIdx < data.length; byteIdx++) {
			// iterate through each bit
			for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
				const bit = (data[byteIdx] >> (7 - bitIdx)) & 0x01;

				if(this.packetLength > 0 && this.currentByte >= this.packetLength) {
					throw new Error("Packet overflow");
				}

				// Add the bit to the current byte (shift left and OR with the new bit)
				this.buffer[this.currentByte] = (this.buffer[this.currentByte] << 1) | bit;

				if((this.buffer[3] >> 7 & 0x01) === 0x01 && this.packetLength === -1) {
					{
						const short = (this.buffer[0] << 8) | this.buffer[1];
						if(((short >> 10) & 0x3F) !== EzFlag.EZ) {
							throw new Error("Malformed packet");
						}
						this.packetLength = short & 0x3FF;
					}

					{
						const short = (this.buffer[2] << 8) | this.buffer[3];
						this.id = (short >> 6) & 0x3FF;
						this.flag = short & 0x3F;
					}

					let data: Buffer | null = Buffer.alloc(4);
					this.buffer.copy(data, 0);

					console.log("allocating", this.packetLength, "current data", this.buffer);
					this.buffer = Buffer.alloc(this.packetLength);
					data.copy(this.buffer, 0);
					data = null;

					// print the packet length, id, and flag
					console.log("packet length:", this.packetLength, "id:", this.id, "flag:", this.flag);
				}

				/*
				switch (this.buffer.length) {
					case 1:
						// get the 6th bit
						const lastFixedHeaderBit = this.buffer[0] >> 6 & 0x01;
						// if the 6th bit is filled we know we have gotten the fixed header
						if (lastFixedHeaderBit === 0x01 && this.packetLength === -1) {
							// get the fixed header
							const header = (this.buffer[0] >> 2) & 0x3F;
							// if the fixed header is not our expected flag we have a malformed packet
							if (header !== EzFlag.EZ) {
								console.log("invalid header:", header);
								throw new Error("Invalid header");
							}
						}
						break;

					case 2:
						// if the last bit is filled we know we have gotten the remainder of the length
						if ((this.buffer[1] >> 7 & 0x01) === 0x01 && this.packetLength === -1) {
							// get the last 4 bits from the previous byte and the 8 bits from the current byte
							this.packetLength = ((this.buffer[0] >> 6) & 0x03) + (this.packetLength << 8) | this.buffer[1];
						}
						break;

					case 4:
						// the last id bits are the first two bits of the next byte, so when we have the data we need, we add it to the id
						const lastIdBitLast = (this.buffer[3] >> 6) & 0x01;
						if (lastIdBitLast === 0x01 && this.id === EzFlag.NULL) {
							// get the previous byte and 2 bits from the current byte
							this.id = ((this.buffer[2] & 0xFF) << 2) | this.buffer[3];
						}

						// check if we have the last flag bit yet
						const lastFlagBit = (this.buffer[3] >> 7) & 0x01;
						if (lastFlagBit === 0x01 && this.flag === EzFlag.NULL) {
							this.flag = (this.buffer[3] >> 2) & 0x3F;
						}

						if(lastFlagBit === 0x01) {
							console.log("packet length:", this.packetLength, "id:", this.id, "flag:", this.flag);
							this.buffer = Buffer.alloc(this.packetLength);
						}
						break;

					default:
						break;
				}*/
			}

			this.currentByte++;
		}

		console.log("inputted data", data,"\ncurrent data", this.buffer);
	}
}