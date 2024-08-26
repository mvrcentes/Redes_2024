# xmpp_client.py
import sys
import slixmpp
import asyncio
import json

if sys.platform == 'win32':
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

class SendMsgBot(slixmpp.ClientXMPP):
    def __init__(self, jid, password):
        super().__init__(jid, password)

        # Event handlers
        self.add_event_handler("session_start", self.start)
        self.add_event_handler("message", self.message_received)

    async def start(self, event):
        """Handle session start."""
        self.send_presence()
        await self.get_roster()

    def message_received(self, msg):
        """Handle incoming messages."""
        if msg['type'] in ('chat', 'normal'):
            self.handle_message(msg)

    def handle_message(self, msg):
        """Este método debe ser sobrescrito por las subclases para manejar mensajes."""
        print(f"Mensaje recibido de {msg['from']}: {msg['body']}")
