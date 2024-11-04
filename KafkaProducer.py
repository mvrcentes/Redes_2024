from confluent_kafka import Producer
import json
import time
import random
from numpy import random as np_random
from enum import Enum

class DireccionViento(Enum):
    N = 'N'
    NO = 'NO'
    O = 'O'
    SO = 'SO'
    S = 'S'
    SE = 'SE'
    E = 'E'
    NE = 'NE'

class EstacionMeteorologica:
    def __init__(self, temp_media=55.0, temp_desviacion=15.0, humedad_media=55, humedad_desviacion=15):
        self.temp_media = temp_media
        self.temp_desviacion = temp_desviacion
        self.humedad_media = humedad_media
        self.humedad_desviacion = humedad_desviacion

    def generar_temperatura(self):
        temp = np_random.normal(self.temp_media, self.temp_desviacion)
        return round(max(0, min(110, temp)), 2)

    def generar_humedad(self):
        humedad = np_random.normal(self.humedad_media, self.humedad_desviacion)
        return int(max(0, min(100, humedad)))

    def generar_direccion_viento(self):
        return random.choice(list(DireccionViento)).value

    def generar_lectura(self):
        lectura = {
            "temperatura": self.generar_temperatura(),
            "humedad": self.generar_humedad(),
            "direccion_viento": self.generar_direccion_viento()
        }
        return json.dumps(lectura)

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
            datos_meteorologicos = estacion.generar_lectura()
            productor.produce(
                topic=topico,
                value=datos_meteorologicos,
                callback=reporte_envio
            )
            productor.poll(0)
            print(f"Generado y enviado: {datos_meteorologicos}")
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
