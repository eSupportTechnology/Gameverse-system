import asyncio
import websockets
import json
from smartcard.System import readers

connected_clients = set()

def write_to_card(user_id):
    """Writes the given user_id to the NTAG card"""
    try:
        r = readers()
        if not r:
            print("No reader found")
            return False

        reader = r[0]
        connection = reader.createConnection()
        connection.connect()
        print("Connected to reader:", reader)

        # Convert user ID to string and then to bytes
        text = str(user_id)
        data_bytes = text.encode("utf-8")

        # NTAG writes 4 bytes per page
        pages_needed = (len(data_bytes) + 3) // 4
        start_page = 4  # First writable page

        for i in range(pages_needed):
            page_data = data_bytes[i*4:(i+1)*4]

            # pad to 4 bytes
            while len(page_data) < 4:
                page_data += b'\x00'

            write_cmd = [
                0xFF, 0xD6, 0x00,
                start_page + i,
                0x04
            ] + list(page_data)

            response, sw1, sw2 = connection.transmit(write_cmd)

            if sw1 != 0x90:
                print(f"Write failed at page {start_page+i}")
                return False

        print("✅ Successfully written to NTAG card")
        return True

    except Exception as e:
        print("Error writing to card:", e)
        return False

async def notify_clients(card_uid):
    """Notify all connected clients of card UID"""
    if connected_clients:
        message = json.dumps({"action": "card_detected", "uid": card_uid})
        await asyncio.gather(*[client.send(message) for client in connected_clients])

async def reader_loop():
    r = readers()
    if not r:
        print("No NFC reader found")
        return
    reader = r[0]
    print("Using NFC reader:", reader)
    last_uid = None

    while True:
        try:
            conn = reader.createConnection()
            conn.connect()

            GET_UID = [0xFF, 0xCA, 0x00, 0x00, 0x00]
            data, sw1, sw2 = conn.transmit(GET_UID)
            if sw1 == 0x90:
                uid_str = ":".join(format(x, "02X") for x in data)
                if uid_str != last_uid:
                    last_uid = uid_str
                    print("Card detected! UID:", uid_str)
                    await notify_clients(uid_str)

            await asyncio.sleep(1)
        except:
            last_uid = None
            await asyncio.sleep(1)

async def ws_handler(websocket):
    print("Client connected")
    connected_clients.add(websocket)

    try:
        async for message in websocket:
            data = json.loads(message)

            if data.get("action") == "write":
                user_id = data.get("data")
                print("Write request received:", user_id)

                success = write_to_card(user_id)

                # Send result back to frontend including the user ID
                await websocket.send(json.dumps({
                    "action": "write_result",
                    "success": success,
                    "userId": user_id   # important!
                }))

    except Exception as e:
        print("WebSocket error:", e)

    finally:
        print("Client disconnected")
        connected_clients.remove(websocket)

async def main():
    print("Starting NFC WebSocket server...")
    await websockets.serve(ws_handler, "0.0.0.0", 6789)
    print("WebSocket server running on ws://0.0.0.0:6789")
    await reader_loop()

if __name__ == "__main__":
    asyncio.run(main())
