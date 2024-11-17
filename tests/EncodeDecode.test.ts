import { assert, expect, it, describe } from "vitest";
import EzEncoder, { EzEncoding } from "../electron/libs/net/ez/EzEncoder";

describe('Encode', () => {
	it.concurrent('Empty', () => {
		let message = "";
		let serialized: any = EzEncoder.encode(message);
		console.log(serialized);
		expect(serialized.length).toBe(Math.ceil(message.length * 6 / 8));
	});

	it.concurrent('Hello, World', () => {
		const message = "hello, world! ";
		const serialized = EzEncoder.encode(message);
		console.log(serialized);
		expect(serialized.length).toBe(Math.ceil(message.length * 6 / 8));
	});

	it.concurrent('Random', () => {
		for (let run = 0; run < 100; run++) {
			let message = "";
			const randomLength = Math.floor(Math.random() * (700 - 2 + 1)) + 2;
			for (let i = 0; i < randomLength; i++) {
				message += EzEncoding[Math.floor(Math.random() * EzEncoding.length)];
			}

			let serialized: any = EzEncoder.encode(message);
			expect(serialized.length, `Run #${run}: Invalid length`).toBe(Math.ceil(message.length * 6 / 8));
		}
		assert(true);
	});
})

describe('Decode', () => {

	it.concurrent('Hello, World!', () => {
		let serialized: any = Buffer.from([
			0xb6, 0xac, 0x71, 0xd0, 0xd0, 0x7c, 0xd3, 0x7c, 0x69, 0x08
		])
		const deEncoded = EzEncoder.decode(serialized);
		expect(deEncoded).toBe("hello, world!");
	});

	it.concurrent('Empty', () => {
		let serialized: any = Buffer.alloc(0);
		const deEncoded = EzEncoder.decode(serialized);
		expect(deEncoded).toBe("");
	});

	it.concurrent('Odd', () => {
		let serialized: any = Buffer.from([
			0xb6, 0xac, 0x71, 0xd0, 0xd0, 0x7c, 0xd3, 0x7c, 0x69, 0x08, 0x10
		]);
		const deEncoded = EzEncoder.decode(serialized);
		expect(deEncoded).toBe("hello, world! ");
	});

	it.concurrent('Random', () => {
		for (let run = 0; run < 100; run++) {
			let message = "";
			const randomLength = Math.max(1, Math.floor(Math.random() * (700 - 2 + 1)) + 2);
			for (let i = 0; i < randomLength; i++) {
				message += EzEncoding[Math.floor(Math.random() * EzEncoding.length)];
			}

			let deEncoded = EzEncoder.decode(EzEncoder.encode(message));
			expect(deEncoded, `Run #${run} - expected length ${message.length} but got length ${deEncoded.length}`).toBe(message);
		}
		assert(true);
	});
});