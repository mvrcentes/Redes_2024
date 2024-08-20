# Archivo principal para ejecutar el programa.

from xmpp_client import XMPPClient


def main():
    jid = input("Enter your JID: ")
    password = input("Enter your password: ")

    xmpp = XMPPClient(jid, password)
    if xmpp.start():
        print("XMPP client started successfully.")
    else:
        print("Failed to start XMPP client.")


if __name__ == "__main__":
    main()
