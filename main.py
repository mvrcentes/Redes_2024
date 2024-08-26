import logging
import asyncio
import argparse
from node import Node

# Configura el logging para depuración
# logging.basicConfig(level=logging.DEBUG)

async def main():
    parser = argparse.ArgumentParser(description='XMPP Node para el Algoritmo de Flooding')
    parser.add_argument('--jid', required=True, help='JID para el nodo (ej: node1@alumchat.lol/resource1)')
    parser.add_argument('--password', required=True, help='Contraseña para el nodo')
    parser.add_argument('--name', required=True, help='Nombre del nodo (ej: Node1)')
    parser.add_argument('--topo', required=True, help='Archivo JSON con la topología')
    parser.add_argument('--names', required=True, help='Archivo JSON con los nombres de los nodos')
    parser.add_argument('--payload', help='Contenido del mensaje de flooding', default='Mensaje de prueba de Flooding')

    args = parser.parse_args()

    # Inicializa el nodo con la configuración de topología y nombres
    node = Node(args.jid, args.password, args.name, args.topo, args.names)

    # Conecta al servidor XMPP
    connection_result = node.connect(('alumchat.lol', 7070), disable_starttls=True)
    if connection_result is not False:
        print(f"{args.name} conectado exitosamente.")
        # Espera un momento para asegurar que la conexión esté establecida
        await asyncio.sleep(1)

        # Envía el mensaje de flooding a todos los vecinos
        node.broadcast_flood_message(args.payload)

        # Mantiene el nodo en ejecución
        await node.disconnected
    else:
        print(f"Fallo al iniciar {args.name}.")

if __name__ == "__main__":
    asyncio.run(main())
