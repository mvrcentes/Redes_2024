def flood(node, message):
    """ Implementa el algoritmo de Flooding enviando el mensaje a todos los vecinos excepto al emisor. """
    for neighbor in node.neighbors:
        if neighbor != message['from'].bare:
            node.send_message(mto=neighbor, mbody=message['body'], mtype='chat')

def link_state_routing(node, message):
    """ Implementa el algoritmo Link State Routing. """
    pass  # Aquí va la lógica para LSR

def distance_vector(node, message):
    """ Implementa el algoritmo Distance Vector Routing. """
    pass  # Aquí va la lógica para DVR
