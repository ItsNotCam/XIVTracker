import asyncio
import websockets

async def hello():
    uri = "ws://localhost:50085"
    async with websockets.connect(uri) as websocket:
        await websocket.send("Hello Server!")
        response = await websocket.recv()
        print(f"Received: {response}")

asyncio.run(hello())
