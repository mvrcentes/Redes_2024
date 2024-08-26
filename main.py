import asyncio
from xmpp_client import SendMsgBot
from config import XMPP_JID, XMPP_PASSWORD, XMPP_HOST, XMPP_PORT, RECEIVER_JID, MESSAGE

async def main():
    xmpp = SendMsgBot(XMPP_JID, XMPP_PASSWORD, RECEIVER_JID, MESSAGE)

    xmpp.connect((XMPP_HOST, XMPP_PORT), disable_starttls=True)
    await xmpp.disconnected

if __name__ == "__main__":
    asyncio.run(main())
