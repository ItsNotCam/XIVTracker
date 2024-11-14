import asyncio
import websockets
import random
import json
from ez_serde_v2 import deserialize, serialize

def get_random_job_data():
	ffxiv_jobs = [
    # Combat Jobs
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
    
    # Gathering Jobs
    "miner",
    "botanist",
    "fisher",
    
    # Crafting Jobs
    "carpenter",
    "blacksmith",
    "armorer",
    "goldsmith",
    "leatherworker",
    "weaver",
    "alchemist",
    "culinarian"
	]

	
	max_xp = random.randint(52350, 82350)
	current_xp = random.randint(0, max_xp)

	return {
		"level": random.randint(1, 90),
		"job_name": random.choice(ffxiv_jobs),
		"current_xp": current_xp,
		"max_xp": max_xp,
	}


async def echo(websocket):
	while True:
		message = await websocket.recv()
		
		# async for message in websocket:
		print(f"Received message: {message}")
		packet = deserialize(message)
		
		flag = packet["flag"]
		payload = packet["payload"]
		
		if flag == 2:
			utf8_msg = payload.encode("utf-8")
			print("sending:", utf8_msg)
			msg = serialize(0x02, utf8_msg, packet["id"])
			await websocket.send(msg)  # Send back to the same websocket connection
		elif flag == 0x21:
			utf8_msg = json.dumps(get_random_job_data()).encode("utf-8")
			print("sending:", utf8_msg)
			msg = serialize(0x21, utf8_msg, packet["id"])
			await websocket.send(msg)  # Send back to the same websocket connection
		
		await websocket.send("response")  # You can also send a response after handling the message


async def main():
    # Create and start the WebSocket server
    start_server = await websockets.serve(echo, "", 50085)
    print("WebSocket server started on ws://localhost:50085")

    # Keep the server running indefinitely (block the event loop)
    await asyncio.Future()  # This will run forever, effectively pausing the event loop

# Run the event loop to start the server
asyncio.run(main())
