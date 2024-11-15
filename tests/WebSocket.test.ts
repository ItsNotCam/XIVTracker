import { WebSocketServer } from 'ws';
import EzWs from '../electron/libs/net/EzWs';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { EzFlag } from '../electron/libs/net/ez/EzTypes.d';
import { EzEncoding } from '../electron/libs/net/ez/EzEncoder';
import { spawn } from 'child_process';

let electronProcess: any;

// start electron progress
beforeAll(() => {
	electronProcess = spawn('npm', ['run', 'dev'], {
		cwd: '../electron',
		shell: true,
		stdio: 'inherit'
	});

	electronProcess.on('error', (err: any) => {
		console.log("electron process error", err.message);
	});

	console.log(`Electron process started with PID: ${electronProcess.pid}`);
});

const get_random_job_data = () => {
	const ffxiv_jobs = [
		//Combat Jobs
		"paladin",
		"warrior",
		"dark knight",
		"gunbreaker",
		"white mage",
		"scholar",
		"astrologian",
		"sage",
		"monk",
		"dragoon",
		"ninja",
		"samurai",
		"reaper",
		"bard",
		"machinist",
		"dancer",
		"black mage",
		"summoner",
		"red mage",
		"blue mage",

		//Gathering Jobs
		"miner",
		"botanist",
		"fisher",

		//Crafting Jobs
		"carpenter",
		"blacksmith",
		"armorer",
		"goldsmith",
		"leatherworker",
		"weaver",
		"alchemist",
		"culinarian"
	]

	const max_xp = Math.floor(Math.random() * (82350 - 52350 + 1)) + 52350;
	const current_xp = Math.floor(Math.random() * (max_xp + 1));

	return {
		"level": Math.floor(Math.random() * 90) + 1,
		"job_name": ffxiv_jobs[Math.floor(Math.random() * ffxiv_jobs.length)],
		"current_xp": current_xp,
		"max_xp": max_xp
	}
}


const fail = (msg?: string) => {
	if (msg) {
		console.error(msg);
	}
	expect(false).toBe(true);
}

const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const SERVER_PORT = 50085;
let wss: WebSocketServer;

beforeAll(() => {
	wss = new WebSocketServer({ port: SERVER_PORT });
	wss.on('connection', (ws) => {
		console.log('Client connected');
		ws.on('message', (message) => {
			ws.send(Buffer.from(message as Buffer));
		});

		ws.on('close', () => {
			console.log('Client disconnected');
		});
	});

	wss.on('listening', () => {
		console.log(`WebSocket server is running on ws://localhost:${SERVER_PORT}`);
	});

	wss.on('error', (error) => {
		console.error('WebSocket server encountered an error:', error);
	});
});


let wsc: EzWs | null = null;
let isConnected = false;
let validated = false;

wsc = await new EzWs(SERVER_PORT, () => { }, (connected) => {
	if (!validated) {
		isConnected = connected;
		validated = true;
	}
}).connect();

test("NULL", { timeout: 10000 }, async () => {
	let success = false;
	for (let i = 0; i < 5; i++) {
		await wait(1000);

		if (!isConnected || wsc === null) {
			fail("Failed to connect to the server");
		}

		const message = 0x00.toString();
		const response = await wsc!.sendAndAwaitResponse(EzFlag.NULL, message);
		if (response === message) {
			success = true;
			break;
		}
	}
	expect(success).toBe(true);
});

test("Hello, World", { timeout: 10000 }, async () => {
	if (!isConnected || wsc === null) {
		fail("Failed to connect to the server");
	}

	await wait(1000);

	const message = "hello, world!";
	const response = await wsc!.sendAndAwaitResponse(EzFlag.NULL, message);
	expect(response).toStrictEqual(message);
});

test("Lorem 200", { timeout: 10000 }, async () => {
	if (!isConnected || wsc === null) {
		fail("Failed to connect to the server");
	}

	await wait(1000);

	const message = "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.".toLowerCase();
	const response = await wsc!.sendAndAwaitResponse(EzFlag.NULL, message);
	expect(response).toStrictEqual(message);
});

test("Random", { timeout: 10000 }, async () => {
	for (let run = 0; run < 20; run++) {
		let message = "";
		const randomLength = Math.max(1, Math.floor(Math.random() * (700 - 2 + 1)) + 2);
		for (let i = 0; i < randomLength; i++) {
			message += EzEncoding[Math.floor(Math.random() * EzEncoding.length)];
		}

		const response = await wsc!.sendAndAwaitResponse(EzFlag.NULL, message);
		expect(message).toBe(response);
		await wait(100);
}});

test("Should decode valid json", { timeout: 10000 }, async () => {
	if (!isConnected || wsc === null) {
		fail("Failed to connect to the server");
	}

	await wait(1000);

	const job_data = get_random_job_data();
	const response = await wsc!.sendAndAwaitResponse(EzFlag.JOB_MAIN, JSON.stringify(job_data));
	expect(response).toStrictEqual(JSON.stringify(job_data));
});

afterAll(() => {
	if(wss !== null) {
		wss.close();
		console.log('WebSocket server closed');
	}

	if (wsc !== null) {
		wsc.close();
		console.log('WebSocket client closed');
	}

	if (electronProcess) {
		electronProcess.kill();
		console.log('Electron process terminated');
	}
});
