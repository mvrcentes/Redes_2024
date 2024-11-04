from confluent_kafka import Producer
import time
import random
from numpy import random as np_random
from enum import Enum

class DireccionViento(Enum):
    N = 0
    NE = 1
    E = 2
    SE = 3
    S = 4
    SO = 5
    O = 6
    NO = 7

class EstacionMeteorologica:
    def __init__(self, temp_media=55.0, temp_desviacion=15.0, humedad_media=55, humedad_desviacion=15):
        self.temp_media = temp_media
        self.temp_desviacion = temp_desviacion
        self.humedad_media = humedad_media
        self.humedad_desviacion = humedad_desviacion

    def generar_temperatura(self):
        temp = np_random.normal(self.temp_media, self.temp_desviacion)
        temp = max(0, min(110, temp))
        return int((temp / 110) * (2**14 - 1))  # Escalar a un valor de 14 bits

    def generar_humedad(self):
        humedad = np_random.normal(self.humedad_media, self.humedad_desviacion)
        humedad = max(0, min(100, humedad))
        return int(humedad)  # Escalar a 7 bits (0-100)

    def generar_direccion_viento(self):
        return random.choice(list(DireccionViento)).value  # 3 bits

    def codificar_datos(self):
        # Genera los datos y codifica en 3 bytes
        temperatura = self.generar_temperatura()
        humedad = self.generar_humedad()
        direccion_viento = self.generar_direccion_viento()

        # Combina los bits de los tres valores en un entero de 24 bits
        datos_codificados = (temperatura << 10) | (humedad << 3) | direccion_viento
        return datos_codificados.to_bytes(3, byteorder='big')  # Convertir a 3 bytes

def reporte_envio(err, msg):
    if err is not None:
        print(f'Error al enviar el mensaje: {err}')
    else:
        print(f'Mensaje enviado a {msg.topic()} [{msg.partition()}]')

def main():
    conf = {
        'bootstrap.servers': 'lab9.alumchat.lol:9092',
        'client.id': 'productor_estacion_meteorologica'
    }

    productor = Producer(**conf)
    estacion = EstacionMeteorologica()
    topico = '21116'

    try:
        while True:
            # Generar y codificar los datos meteorológicos
            datos_codificados = estacion.codificar_datos()
            
            # Enviar los datos codificados a Kafka
            productor.produce(
                topic=topico,
                value=datos_codificados,
                callback=reporte_envio
            )
            productor.poll(0)
            
            print(f"Datos codificados y enviados: {datos_codificados.hex()}")
            
            # Esperar entre 15 y 30 segundos antes de la siguiente lectura
            tiempo_espera = random.uniform(15, 30)
            time.sleep(tiempo_espera)

    except KeyboardInterrupt:
        print("\nInterrumpido por el usuario. Limpiando...")
    finally:
        print("Enviando mensajes restantes...")
        productor.flush()
        print("Productor cerrado.")

if __name__ == '__main__':
    main()
