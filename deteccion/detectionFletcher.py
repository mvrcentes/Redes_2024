import random

# Funciones para el cálculo de Fletcher
def fletcher_checksum(data):
    sum1 = 0
    sum2 = 0
    mod = 255

    for byte in data:
        sum1 = (sum1 + byte) % mod
        sum2 = (sum2 + sum1) % mod

    checksum = (sum2 << 8) | sum1
    return checksum

def verify_checksum(data, checksum):
    calculated_checksum = fletcher_checksum(data)
    return calculated_checksum == checksum

# Capa de Enlace y Ruido
def generar_trama(mensaje):
    codigo_binario = ''.join(format(ord(char), '08b') for char in mensaje)
    data = [int(codigo_binario[i:i+8], 2) for i in range(0, len(codigo_binario), 8)]
    checksum = fletcher_checksum(data)
    trama_con_integridad = codigo_binario + format(checksum, '016b')  # Agregar checksum

    # Aplicar ruido (probabilidad de 0.01)
    trama_con_ruido = ''.join(bit if random.random() > 0.01 else str(1 - int(bit)) for bit in trama_con_integridad)

    return trama_con_ruido

# Capa de Enlace
def recibir_trama(trama_recibida):
    trama_recibida_sin_ruido = trama_recibida.replace(" ", "")  # Eliminar ruido
    received_checksum = trama_recibida_sin_ruido[-16:]  # Extraer checksum recibido
    received_data = trama_recibida_sin_ruido[:-16]
    received_data = [int(received_data[i:i+8], 2) for i in range(0, len(received_data), 8)]
    is_checksum_valid = verify_checksum(received_data, int(received_checksum, 2))

    if is_checksum_valid:
        mensaje_decodificado = ''.join(chr(byte) for byte in received_data)
        return mensaje_decodificado
    else:
        return "Error: Se detectaron errores en la trama."

# Función principal
def main():
    mensaje = input("Ingrese el mensaje a enviar: ")

    # Generar trama con integridad y ruido
    trama_enviada = generar_trama(mensaje)

    # Emisor envía la trama al receptor
    print("Trama enviada:", trama_enviada)

    # Receptor recibe y procesa la trama
    mensaje_recibido = recibir_trama(trama_enviada)
    print("Mensaje recibido:", mensaje_recibido)

if __name__ == "__main__":
    main()
