#node.py
from xmpp_client import SendMsgBot
from routing import flood
import json
import uuid
from utils import load_config

class Node(SendMsgBot):
    def __init__(self, jid, password, node_name, topo_file, names_file):
        super().__init__(jid, password)
        self.node_name = node_name  # Almacena el nombre del nodo
        self.neighbors = {}  # Diccionario de vecinos: {jid: distancia}
        self.seen_messages = set()  # Para evitar procesar el mismo mensaje varias veces
        self.topology = load_config(topo_file)  # Carga la topología desde el archivo
        self.node_names = load_config(names_file)  # Carga los nombres de nodos desde el archivo
        self.add_event_handler("session_start", self.start)
        self.add_event_handler("message", self.handle_message)

        # Configura los vecinos según la topología
        self._setup_neighbors()

    def _setup_neighbors(self):
        """Configura los vecinos según la topología y el nombre del nodo."""
        neighbors = self.topology['config'].get(self.node_name, [])
        for neighbor in neighbors:
            neighbor_jid = self.node_names['config'].get(neighbor)
            if neighbor_jid:
                self.add_neighbor(neighbor_jid, 1)  # Asigna una distancia de 1 por defecto

    def add_neighbor(self, neighbor_jid, distance):
        """Agrega un vecino al nodo con la distancia asociada."""
        self.neighbors[neighbor_jid] = distance

    def handle_message(self, msg):
        """Maneja los mensajes recibidos y aplica el algoritmo de enrutamiento."""
        try:
            msg_data = json.loads(msg['body'])
        except json.JSONDecodeError:
            print(f"{self.node_name} recibió un mensaje JSON inválido de {msg['from']}")
            return

        msg_type = msg_data.get("type")

        if msg_type == "flooding":
            msg_id = msg_data.get("id")
            if msg_id in self.seen_messages:
                # Mensaje ya procesado, ignorar para evitar bucles
                print(f"{self.node_name} ignoró un mensaje duplicado con ID {msg_id}.")
                return
            else:
                self.seen_messages.add(msg_id)
                print(f"{self.node_name} recibió un nuevo mensaje de flooding: {msg_data['payload']} con ID {msg_id}")

            # Verifica si este nodo es el destinatario final
            if self.boundjid.bare == msg_data.get("to"):
                print(f"{self.node_name} es el destinatario final del mensaje: {msg_data['payload']}")
                return

            # Maneja el reenvío del mensaje
            immediate_sender_jid = msg['from'].bare
            print(f"{self.node_name} reenvía el mensaje a todos los vecinos excepto {immediate_sender_jid}")
            flood(self, msg_data, immediate_sender_jid)

    def send_flood_message(self, to_jid, payload):
        """Envía un mensaje de flooding a un vecino específico."""
        msg_id = str(uuid.uuid4())
        message = {
            "type": "flooding",
            "id": msg_id,
            "from": self.boundjid.full,  # Incluye el recurso
            "to": to_jid,  # Destinatario final
            "hops": 0,
            "headers": [],
            "payload": payload
        }
        self.send_message(mto=to_jid, mbody=json.dumps(message), mtype='chat')
        print(f"{self.node_name} envió un mensaje de flooding a {to_jid} con ID {msg_id}")
        self.seen_messages.add(msg_id)  # Marca como visto para evitar re-procesamiento

    def broadcast_flood_message(self, payload, exclude_jid=None):
        """Reenvía un mensaje de flooding a todos los vecinos excepto a exclude_jid."""
        msg_id = str(uuid.uuid4())
        message = {
            "type": "flooding",
            "id": msg_id,
            "from": self.boundjid.full,
            "to": None,  # Se establece por cada vecino
            "hops": 0,
            "headers": [],
            "payload": payload
        }
        for neighbor_jid in self.neighbors:
            if neighbor_jid != exclude_jid:
                message_copy = message.copy()
                message_copy['to'] = neighbor_jid  # El destinatario final sigue siendo el mismo
                self.send_message(mto=neighbor_jid, mbody=json.dumps(message_copy), mtype='chat')
                print(f"{self.node_name} reenvía el mensaje a {neighbor_jid}")
        self.seen_messages.add(msg_id)  # Marca como visto

    def on_message_received(self, msg):
        # Extraer el mensaje y su contenido
        body = msg['body']
        sender = msg['from']
        
        # Procesar el mensaje (puede que desees agregar lógica aquí para evitar ciclos infinitos)
        print(f"Mensaje recibido de {sender}: {body}")
        
        # Identificar a este nodo
        my_jid = self.boundjid.bare
        my_name = self.get_name_by_jid(my_jid)
        
        # Propagar el mensaje a los vecinos
        self.propagate_message(my_name, body, sender)

    def get_name_by_jid(self, jid):
        # Función para mapear JID al nombre del nodo según la configuración
        for name, node_jid in self.name_config.items():
            if node_jid == jid:
                return name
        return None

    def propagate_message(self, node_name, message, sender):
        # Obtener la lista de vecinos para este nodo
        neighbors = self.topo_config[node_name]
        
        # Enviar el mensaje a cada vecino
        for neighbor in neighbors:
            neighbor_jid = self.name_config[neighbor]
            if sender != neighbor_jid:  # Evitar enviar el mensaje de vuelta al remitente inmediato
                self.send_message(mto=neighbor_jid, mbody=message, mtype='chat')
                print(f"Mensaje propagado de {node_name} a {neighbor}")
