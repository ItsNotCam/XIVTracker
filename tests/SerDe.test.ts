import { assert, describe, expect, it } from "vitest";
import { throws } from "assert";
import EzSerDe from "../electron/libs/net/EzSerDe";


describe("Serialize", async () => {
	it.concurrent("NULL", async() => {
		const result = EzSerDe.serialize(EzFlag.NULL, Buffer.alloc(0), 0);
		expect(result.length).toBe(4);
	})

	it.concurrent("Hello, World!", async() => {
		const message = "Hello, World!";
		const result = EzSerDe.serialize(EzFlag.NULL, Buffer.from(message), 0);
		expect(result.length).toBe(4 + Math.ceil(message.length * 6 / 8));
	})

	it.concurrent("Lorem 200", async() => {
		const message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
		const result = EzSerDe.serialize(EzFlag.NULL, Buffer.from(message), 0);
		expect(result.length).toBe(4 + Math.ceil(message.length * 6 / 8));
	})
	
	it.concurrent('random', () => {
		for(let run = 0; run < 100; run++) {
			let message = "";
			const characters = 'abcdefghijklmnopqrstuvwxyz0123456789_,{}[]()-';
			const randomLength = Math.floor(Math.random() * (700 - 2 + 1)) + 2;
			for (let i = 0; i < randomLength; i++) {
				message += characters.charAt(Math.floor(Math.random() * characters.length));
			}

			let serialized: any = EzSerDe.serialize(EzFlag.EZ, Buffer.from(message), 0);
			expect(serialized.length, `Run #${run}: Invalid payload length`).toBe(Math.ceil(message.length * 6 / 8) + 4);
		}
		assert(true);
	});
});

describe('Deserialize', () => { 
	it.concurrent('Invalid', () => {
		throws(() => { 
			EzSerDe.deserialize(Buffer.from([0x00, 0x00, 0x00, 0x00])) 
		}, new Error("Malformed packet"));
	});
	
	it.concurrent('NULL', () => {
		let result: any | null;

		try {
			const serialized = EzSerDe.serialize(EzFlag.NULL, Buffer.alloc(0));
			result = EzSerDe.deserialize(serialized);
		} catch(e) {
			assert(false, `Failed to deserialize packet: ${e}`);
		}

		expect(result.id,"Id should be null, it is " + result.id).toBe(0x00);
		expect(result.flag, 'Invalid flag.').toBe(EzFlag.NULL);
		expect(result.payload.length, "Invalid payload length").toBe(0);
		expect(result.payload.toString(), "Invalid payload").toBe("");
	});
	
	it.concurrent('Hello, World!', () => {
		let result: any | null;

		const message = "hello, world!";
		let serialized: any;
		try {
			serialized = EzSerDe.serialize(EzFlag.EZ, Buffer.from(message), 0);
			result = EzSerDe.deserialize(serialized);
		} catch(e) {
			assert(false, `Failed to deserialize packet: ${e}`);
		}

		const resultMessage = result.payload.toString();
		expect(result.id,"Id should be 0, it is " + result.id).toBe(0);
		expect(result.flag, 'Invalid flag.').toBe(EzFlag.EZ);
		expect(resultMessage.length, "Invalid payload length").toBe(message.length);
		expect(resultMessage, "Invalid payload").toBe(message);
	});
	
	it.concurrent('Lorem 200', () => {
		let result: any | null;

		const message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.".toLowerCase();
		let serialized: any;
		try {
			serialized = EzSerDe.serialize(EzFlag.EZ, Buffer.from(message), 500);
			result = EzSerDe.deserialize(serialized);
		} catch(e) {
			assert(false, `Failed to deserialize packet: ${e}`);
		}

		const resultMessage = result.payload.toString();
		expect(result.id,"Id should be 500, it is " + result.id).toBe(500);
		expect(result.flag, 'Invalid flag.').toBe(EzFlag.EZ);
		expect(resultMessage.length, "Invalid payload length").toBe(message.length);
		expect(resultMessage, "Invalid payload").toBe(message);
	});
	
	
	it.concurrent('random', () => {
		for(let run = 0; run < 100; run++) {
			let result: any | null;

			let message = "";
			const characters = 'abcdefghijklmnopqrstuvwxyz0123456789_,{}[]()-';
			const randomLength = Math.floor(Math.random() * (700 - 2 + 1)) + 2;
			for (let i = 0; i < randomLength; i++) {
				message += characters.charAt(Math.floor(Math.random() * characters.length));
			}

			let serialized: any;
			try {
				serialized = EzSerDe.serialize(EzFlag.EZ, Buffer.from(message), 0);
				result = EzSerDe.deserialize(serialized);
			} catch(e) {
				assert(false, `Failed to deserialize packet: ${e}`);
			}

			const resultMessage = result.payload.toString();
			expect(result.id,`Run #${run}: Id should be 0, it is ` + result.id).toBe(0);
			expect(result.flag, `Run #${run}: Invalid flag.`).toBe(EzFlag.EZ);
			expect(resultMessage.length, `Run #${run}: Invalid payload length`).toBe(message.length);
			expect(resultMessage, `Run #${run}: Invalid payload`).toBe(message);
		}
		assert(true);
	});
})