# Maneja la conexión y comunicación XMPP

import slixmpp
from slixmpp.exceptions import IqError, IqTimeout


class XMPPClient(slixmpp.ClientXMPP):
    def __init__(self, jid, password):
        super().__init__(jid, password)
        self.add_event_handler("session_start", self.session_start)
        self.add_event_handler("message", self.message)
        # Agregar un handler para desconexiones
        self.add_event_handler("disconnected", self.disconnected)
        # Indicador de conexión exitosa
        self.connected_event = slixmpp.xmlstream.handler.callback.Callback(
            'Connected', slixmpp.xmlstream.matcher.MatchXPath("{jabber:client}iq[@type='result']"), self.handle_connected)

    async def session_start(self, event):
        print("Session started successfully.")
        await self.get_roster()
        self.send_presence()

    async def message(self, msg):
        if msg['type'] in ('chat', 'normal'):
            print(f"Message from {msg['from']}: {msg['body']}")

    def disconnected(self, event):
        print("Disconnected from the server.")

    def handle_connected(self, iq):
        print("Successfully connected and authenticated.")

    def start(self):
        self.register_plugin('xep_0030')  # Service Discovery
        self.register_plugin('xep_0199')  # XMPP Ping
        self.register_plugin('xep_0045')  # Multi-User Chat
        self.register_plugin('xep_0096')  # File transfer

        if self.connect(disable_starttls=True):
            self.process(forever=False)
            return True
        else:
            print("Failed to connect.")
            return False
