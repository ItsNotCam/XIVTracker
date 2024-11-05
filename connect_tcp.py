import socket
import time
import random

def connect_tcp_server():
    server_address = ('localhost', 58008)
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

    # Set TCP options after socket creation
    sock.setsockopt(socket.IPPROTO_TCP, socket.TCP_NODELAY, 1)  # Disables Nagle's algorithm
    # Note: TCP_FASTOPEN might not be supported on all systems. Enable if necessary and supported.
    # sock.setsockopt(socket.SOL_TCP, socket.TCP_FASTOPEN, 1)

    try:
        sock.connect(server_address)
        print("Connected to TCP server")
        sock.sendall(b"Hello, server!")
    except Exception as e:
        print(f"Failed to connect: {e}")
    finally:
        sock.close()

if __name__ == "__main__":
    connect_tcp_server()
