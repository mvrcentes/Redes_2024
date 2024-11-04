import matplotlib.pyplot as plt
from collections import deque
from confluent_kafka import Consumer, KafkaError
import json
import time
import numpy as np
import pandas as pd

class VisualizadorDatosMeteorologicos:
    def __init__(self, tamano_ventana=30):
        self.tamano_ventana = tamano_ventana
        self.tiempo_inicio = time.time()
        self.tiempos_transcurridos = deque(maxlen=tamano_ventana)
        self.temperaturas = deque(maxlen=tamano_ventana)
        self.humedades = deque(maxlen=tamano_ventana)
        self.direcciones_viento = deque(maxlen=tamano_ventana)

        plt.ion()
        self.figura, (self.ax_temp, self.ax_hum, self.ax_viento) = plt.subplots(3, 1, figsize=(12, 12))
        self.figura.suptitle('Datos en Tiempo Real de la Estación Meteorológica', fontsize=16)

        # Gráfico de temperatura
        self.ax_temp.set_title("Temperatura (°C)", fontsize=12)
        self.ax_temp.set_xlabel("Tiempo Transcurrido (segundos)", fontsize=10)
        self.ax_temp.set_ylabel("Temperatura (°C)", fontsize=10)
        self.ax_temp.grid(True, linestyle="--", alpha=0.6)

        # Gráfico de humedad
        self.ax_hum.set_title("Humedad (%)", fontsize=12)
        self.ax_hum.set_xlabel("Tiempo Transcurrido (segundos)", fontsize=10)
        self.ax_hum.set_ylabel("Humedad (%)", fontsize=10)
        self.ax_hum.grid(True, linestyle="--", alpha=0.6)

        # Gráfico circular de dirección del viento
        self.ax_viento.set_title("Dirección del Viento", fontsize=12)
        self.direcciones_labels = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO']
        self.direcciones_contadores = [0] * len(self.direcciones_labels)
        self.barras = self.ax_viento.bar(self.direcciones_labels, self.direcciones_contadores, color='teal', alpha=0.7)

        plt.tight_layout(rect=[0, 0, 1, 0.95])

    def actualizar_grafico(self):
        self.ax_temp.clear()
        self.ax_temp.plot(list(self.tiempos_transcurridos), list(self.temperaturas), 'r-', linewidth=1.5, label="Temperatura (°C)")
        self.ax_temp.legend()
        self.ax_temp.grid(True, linestyle="--", alpha=0.6)

        self.ax_hum.clear()
        self.ax_hum.plot(list(self.tiempos_transcurridos), list(self.humedades), 'b-', linewidth=1.5, label="Humedad (%)")
        self.ax_hum.legend()
        self.ax_hum.grid(True, linestyle="--", alpha=0.6)

        # Actualizar gráfico de dirección del viento
        self.ax_viento.clear()
        self.ax_viento.bar(self.direcciones_labels, self.direcciones_contadores, color='teal', alpha=0.7)
        self.ax_viento.set_title("Dirección del Viento")
        self.ax_viento.set_ylabel("Frecuencia")

        self.figura.canvas.draw()
        self.figura.canvas.flush_events()

    def agregar_punto_dato(self, datos):
        tiempo_transcurrido = time.time() - self.tiempo_inicio
        self.tiempos_transcurridos.append(tiempo_transcurrido)
        self.temperaturas.append(datos['temperatura'])
        self.humedades.append(datos['humedad'])

        direccion = datos['direccion_viento']
        if direccion in self.direcciones_labels:
            indice = self.direcciones_labels.index(direccion)
            self.direcciones_contadores[indice] += 1

        self.actualizar_grafico()

def consumir_datos_meteorologicos():
    configuracion = {
        'bootstrap.servers': 'lab9.alumchat.lol:9092',
        'group.id': 'grupo_visualizacion_meteorologica',
        'auto.offset.reset': 'earliest'
    }

    consumidor = Consumer(configuracion)
    topico = '21116'
    consumidor.subscribe([topico])

    visualizador = VisualizadorDatosMeteorologicos()

    try:
        while True:
            mensaje = consumidor.poll(1.0)

            if mensaje is None:
                continue
            if mensaje.error():
                if mensaje.error().code() == KafkaError._PARTITION_EOF:
                    print('Fin de la partición alcanzado')
                else:
                    print(f'Error: {mensaje.error()}')
                continue

            try:
                datos_meteorologicos = json.loads(mensaje.value())
                print(f"Datos meteorológicos recibidos: {datos_meteorologicos}")
                visualizador.agregar_punto_dato(datos_meteorologicos)
                
            except json.JSONDecodeError as e:
                print(f"Error al decodificar JSON: {e}")
                continue

    except KeyboardInterrupt:
        print("Cerrando...")
    finally:
        consumidor.close()
        plt.ioff()
        plt.close('all')

if __name__ == "__main__":
    consumir_datos_meteorologicos()
