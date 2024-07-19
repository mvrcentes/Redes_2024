# Laboratorio 2: Detección de errores con checksum de Fletcher

def fletcher_checksum(data, block_size):
    padding_length = block_size - (len(data) % block_size)
    data += '0' * padding_length
    data_bytes = [int(data[i:i+8], 2) for i in range(0, len(data), 8)]
    sum1 = 0
    sum2 = 0

    for i in range(0, len(data_bytes), block_size):
        block = data_bytes[i:i + block_size]
        for byte in block:
            sum1 = (sum1 + byte) % 255
            sum2 = (sum2 + sum1) % 255

    checksum = (sum2 << 8) | sum1
    return checksum


def verify_checksum(data, checksum, block_size):
    calculated_checksum = fletcher_checksum(data, block_size)
    if calculated_checksum == checksum:
        print("El checksum es válido.")
    else:
        print("Error: El checksum no coincide. Se han detectado errores en la trama de datos.")

        data_bytes = [int(data[i:i+8], 2) for i in range(0, len(data), 8)]
        data_received_bytes = [int(data_received[i:i+8], 2) for i in range(0, len(data_received), 8)]

        for i in range(len(data_bytes)):
            if data_bytes[i] != data_received_bytes[i]:
                error_position = i * 8
                print(f"Posición {error_position}: Valor original: {bin(data_bytes[i])[2:].zfill(8)}, Valor recibido: {bin(data_received_bytes[i])[2:].zfill(8)}")

data = input("Ingrese la trama de datos en formato binario: ")
block_size = int(input("Ingrese el tamaño del bloque (8, 16 o 32): "))

if block_size not in [8, 16, 32]:
    print("Tamaño de bloque inválido. Por favor, ingrese 8, 16 o 32.")
else:
    padding = "0" * (block_size - (len(data) % block_size))

    checksum = fletcher_checksum(data, block_size)
    print("Checksum calculado para datos originales:", bin(checksum)[2:].zfill(block_size))

    data_received = data

    checksum_received = fletcher_checksum(data_received, block_size)
    print("Trama de datos recibidos sin errores:", data_received + padding)
    print("Checksum recibido:", bin(checksum_received)[2:].zfill(block_size))
    verify_checksum(data, checksum_received, block_size)