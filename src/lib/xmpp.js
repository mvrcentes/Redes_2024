import { client, xml } from "@xmpp/client"
import { setCookie, destroyCookie } from "nookies"

class XMPPCLient {
  constructor(service, username, password) {
    this.service = service
    this.username = username
    this.password = password
    this.xmppClient = null
    this.contacts = []
  }

  async initialize() {
    if (this.xmppClient) {
      await this.xmppClient.stop().catch(console.error)
    }

    this.xmppClient = client({
      service: this.service,
      resource: "web",
      username: this.username,
      password: this.password,
    })

    // Configura los eventos del cliente XMPP
    this.xmppClient.on("error", (err) => console.log(err))
    this.xmppClient.on("offline", () => console.log("offline"))
    this.xmppClient.on("online", async () => {
      const token = "authenticated"

      setCookie(null, "token", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })

      this.xmppClient.on("stanza", (stanza) => {
        console.log("Incoming stanza:", stanza.toString())

        if (stanza.is("message")) {
          console.log("Message:", stanza.getChildText("body"))
        }
      })
      await this.xmppClient.send(xml("presence"))
    })

    try {
      await this.xmppClient.start()
      console.log("XMPP Client started")
    } catch (error) {
      console.error("Failed to start XMPP Client:", error)
    }
  }

  async close() {
    if (this.xmppClient) {
      try {
        await this.xmppClient.stop()
        console.log("XMPP Client stopped")
      } catch (error) {
        console.error("Failed to stop XMPP Client:", error)
      }
    }
  }

  async logout() {
    if (this.xmppClient) {
      await this.xmppClient.stop()
      destroyCookie(null, "authToken") // Elimina la cookie de autenticación
      console.log("Logged out and cookie removed")
    }
  }

  async getConversations() {
    if (this.xmppClient) {
      try {
        this.xmppClient.on("stanza", (stanza) => {
          console.log("Incoming stanza:", stanza.toString())
        })
      } catch (error) {
        console.error("Failed to get roster:", error)
      }
    }
  }

  async sendContactRequest(jid) {
    if (this.xmppClient) {
      const subscriptionRequest = xml("presence", {
        to: jid,
        type: "subscribe",
      })
      try {
        if (this.xmppClient.status === "online") {
          console.log("Sending contact request")
          await this.xmppClient.send(subscriptionRequest)
          console.log("Contact request sent")
        }
      } catch (error) {
        console.error("Failed to send contact request:", error)
      }
    }
  }

  async receiveContactRequest() {
    if (this.xmppClient) {
      try {
        this.xmppClient.on("stanza", (stanza) => {
          // Verifica si la stanza es de tipo 'presence'
          if (stanza.is("presence")) {
            // Verifica si el tipo de presencia es 'subscribe', lo que indica una invitación de contacto
            if (stanza.attrs.type === "subscribe") {
              const from = stanza.attrs.from // El JID del usuario que está enviando la invitación
              console.log(`Received contact subscription request from: ${from}`)

              // Aquí puedes manejar la solicitud, como mostrar una notificación al usuario
              // o agregar una función para aceptar/rechazar la solicitud
            }
          }
        })
      } catch (error) {
        console.error("Failed to receive contact request:", error)
      }
    }
  }

  // Setters

  // Getters
}

export default XMPPCLient
