import { WebSocketServer } from 'ws';
import EzWs from '../electron/libs/net/EzWs';
import { afterAll, assert, beforeAll, describe, expect, it, suite, test } from 'vitest';
import { EzFlag } from '../electron/libs/net/ez/EzTypes.d';
import EzSerDe from '../electron/libs/net/ez/EzSerDe';
import EzEncoder, { EzEncoding } from '../electron/libs/net/ez/EzEncoder';
import { spawn } from 'child_process';

let electronProcess: any;

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


const wait = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const SERVER_PORT = 50085;
let wss: WebSocketServer;

beforeAll(() => {
	wss = new WebSocketServer({ port: SERVER_PORT });
	wss.on('connection', (ws) => {
		console.log('Client connected');
		ws.on('message', (message) => {
			const deserializedMsg = EzSerDe.deserialize(Buffer.from(message.toString()));
			ws.send(
				EzSerDe.serialize(deserializedMsg.flag, Buffer.from(
					JSON.stringify(get_random_job_data())
				), deserializedMsg.id)
			);
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

test("Random Jobs", { timeout: 9999999 }, async () => {
	for (let run = 0; run < 20; run++) {
		let message = JSON.stringify(get_random_job_data());
		const response = await wsc!.sendAndAwaitResponse(EzFlag.NULL, message);
		// expect(message).toBe(response);
		await wait(100);
}});

afterAll(() => {
	if(wss !== null) {
		wss.close();
		console.log('WebSocket server closed');
	}

	if (wsc !== null) {
		wsc.close();
		console.log('WebSocket client closed');
	}
});
