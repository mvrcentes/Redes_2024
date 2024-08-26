# routing.py
import json

def flood(node, msg_data, immediate_sender_jid):
    """
    Implementa el algoritmo de Flooding reenviando el mensaje a todos los vecinos
    excepto al remitente inmediato.
    """
    # Incrementa el contador de saltos
    msg_data['hops'] += 1

    # Reconstruye el mensaje JSON
    message_body = json.dumps(msg_data)

    # Reenvía a todos los vecinos excepto al remitente inmediato
    for neighbor_jid in node.neighbors:
        if neighbor_jid != immediate_sender_jid:
            print(f"{node.node_name} va a reenviar el mensaje a {neighbor_jid}")
            node.send_message(mto=neighbor_jid, mbody=message_body, mtype='chat')
            print(f"{node.node_name} reenvió el mensaje a {neighbor_jid}")
