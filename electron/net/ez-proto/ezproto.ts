// ez      -> 29 	  | 1  bytes | 8 bits
// length  -> ...   | 2  bytes | 16 bits
// id			 -> ...   | 8  bytes | 64 bits  | uuid.v4().substring(0,8)
// payload -> ...   | 64 bytes | 512 bits | payload
// ez			 -> 29		| 1  byte  | 8 bits

// just so i know what its meant to be
export const ezDeserialize = (msg: Buffer) => {
	if(msg.length < 13) {
		throw new Error("Malformed packet")
	}

	const ez = msg.readInt8();
	const length = msg.readInt16BE(1);
	const id = msg.toString("utf-8", 3, 11);
	const message = msg.toString("utf-8", 11, 12+length);
	// const ez = msg.readInt8(12+length+1);

	console.log(`packet:\nLength: ${length}\nID:'${id}'\nMessage: '${message}'\n`);//, ez2);
	return {
		id: id,
		data: message
	}
}

export const ezSerialize = (data: any, id: string = "00000000"): Buffer => {
	let uu = Buffer.alloc(2)
	uu.writeUint16BE(Math.min(data.length, 64))

	const outData: Buffer = Buffer.from([
		0x1D,
		...uu,
		...Buffer.from(id.substring(0,8)),
		...data,
		0x1D
	])

	return outData;
}

