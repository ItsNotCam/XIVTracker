export const EzEncodingArray = [
	"NUL", " ", "!", "\"", "#", "$", "%", "&", "'", "(", ")", "*", "+", ",", "-", ".", 
	"/", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", "<", "=", ">", "?", "@", 
	"[", "]", "{", "}", "_", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", 
	"m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
];

class EzEncoder {
	private word: number = 0;
	private bitsUsed: number = 0;
	private buffer: Buffer;
	private bufferIndex: number = 0;

	constructor(private bitSize: number, private bufferSize: number) {
			this.buffer = Buffer.alloc(bufferSize);
	}

	pack(value: number): void {
			this.word = (this.word << this.bitSize) | (value & ((1 << this.bitSize) - 1));
			this.bitsUsed += this.bitSize;

			while (this.bitsUsed >= 8) {
					this.buffer[this.bufferIndex++] = (this.word >> (this.bitsUsed - 8)) & 0xFF;
					this.bitsUsed -= 8;
			}
	}

	finalize(): Buffer {
			if (this.bitsUsed > 0) {
					this.buffer[this.bufferIndex] = (this.word << (8 - this.bitsUsed)) & 0xFF;
			}
			return this.buffer;
	}
}

class EzDecoder {
	private word: number = 0;
	private bitsUsed: number = 0;
	public bufferIndex: number = 0;
	private buffer: Buffer;

	constructor(private bitSize: number, buffer: Buffer) {
			this.buffer = buffer;
	}

	unpack(): number {
			if (this.bitsUsed < this.bitSize) {
					this.word = this.word << 8 | (this.buffer[this.bufferIndex++] & 0xFF);
					this.bitsUsed += 8;
			}

			const result = this.word >> (this.bitsUsed - this.bitSize) & ((1 << this.bitSize) - 1);
			this.bitsUsed -= this.bitSize;
			return result;
	}
}

export const EzDecode = (buffer: Buffer): string => {
	const bitUnpacker = new EzDecoder(6, buffer);
	let decodedString = "";

	// Decode each 6-bit chunk from the buffer
	while (bitUnpacker.bufferIndex < buffer.length) {
			const encodedValue = bitUnpacker.unpack();
			if(encodedValue >= EzEncodingArray.length || encodedValue < 0) {
				decodedString += "~"
			} else {
				decodedString += EzEncodingArray[encodedValue]
			}
	}

	return decodedString;
};


export const EzEncode = (data: string): Buffer => {
	const length = data.length;
	const bufferSize = Math.ceil((length * 6) / 8);
	const bitPacker = new EzEncoder(6, bufferSize);

	for (let i = 0; i < length; i++) {
			let char = Math.max(0x00, EzEncodingArray.indexOf(data[i]))
			bitPacker.pack(char & 0x3F);
	}

	return bitPacker.finalize();
};
