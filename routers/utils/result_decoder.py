import json

def decode(data: bytes) -> dict:
    # i dont know why request encodes these symbols, but fuck me i guess
    return json.loads(
        data.decode()
            .replace("result=", "")
            .replace("%5B", "[")
            .replace("%5D", "]")
            .replace("%7B", "{")
            .replace("%7D", "}")
            .replace("%22", "\"")
            .replace("%3A", ":")
            .replace("%2C", ",")
            .replace("+",   " "))