from xmpp_client import XMPPClient

class Node(XMPPClient):
    def __init__(self, jid, password, node_name, recipient=None, message=None):
        super().__init__(jid, password, recipient, message)
        self.node_name = node_name
        self.neighbors = {}  # Diccionario de vecinos y costos

    def add_neighbor(self, neighbor_name, distance):
        self.neighbors[neighbor_name] = distance
