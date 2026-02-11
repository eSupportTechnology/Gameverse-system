from smartcard.System import readers

def read_card():
    r = readers()
    if not r:
        print("No NFC reader found")
        return

    reader = r[0]
    connection = reader.createConnection()
    connection.connect()
    print("Connected to reader:", reader)

    start_page = 4  # first writable page
    pages_to_read = 4  # adjust if your data spans more pages
    card_data = []

    for page in range(start_page, start_page + pages_to_read):
        # Command to read 4 bytes from a page
        read_cmd = [0xFF, 0xB0, 0x00, page, 0x04]
        response, sw1, sw2 = connection.transmit(read_cmd)

        if sw1 == 0x90:
            card_data.extend(response)
        else:
            print(f"Failed to read page {page}: SW1={sw1}, SW2={sw2}")
            break

    # Convert bytes to string and remove padding zeros
    card_str = "".join(chr(b) for b in card_data if b != 0)
    print("Data on card:", card_str)

if __name__ == "__main__":
    read_card()
