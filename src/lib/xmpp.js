import { client, xml } from "@xmpp/client"
import { setCookie, destroyCookie } from "nookies"
import User from "./User"

class XMPPCLient {
  constructor(service, username, password) {
    this.service = service
    this.username = username
    this.password = password
    this.xmppClient = null
    this.contacts = []
    this.notifications = []
    this.notificationListeners = []
    this.users = []
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
          if (stanza.is("message")) {
            console.log("Message:", stanza.getChildText("body"))
            const from = stanza.attrs.from.slice(
              0,
              stanza.attrs.from.indexOf("/")
            )
            const message = stanza.getChildText("body")

            console.log("from", from)

            if (!this.users.find((user) => user.jid === from)) {
              // Si no está, agrega un nuevo usuario
              this.users.push(new User(from))
            }

            const user = this.users.find((user) => user.jid === from)
            if (user) {
              if (message !== null)
                user.messages.push({
                  message: message,
                  from: from,
                })
              console.log(user.messages)
            }
          }

          console.log(this.users)
        })
      } catch (error) {
        console.error("Failed to get roster:", error)
      }
    }
  }

  async sendMessage(jid, messageData) {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    if (this.xmppClient.status === "online") {
      const message = xml(
        "message",
        { type: "chat", to: jid },
        xml("body", {}, messageData)
      )

      try {
        await this.xmppClient.send(message)
        console.log("Message sent")

        const to = this.users.find((user) => user.jid === jid)
        if (to) {
          to.messages.push({
            message: messageData,
            from: this.xmppClient.jid.toString(),
          })
          this.notifyUserUpdate(jid) // Notifica que se ha actualizado el usuario
        }
      } catch (error) {
        console.log("Failed to send message:", error)
      }
    } else {
      console.log("Client is not online")
    }
  }

  // Método para notificar que un usuario ha sido actualizado
  notifyUserUpdate(jid) {
    const user = this.users.find((user) => user.jid === jid)
    if (user && user.onUpdate) {
      user.onUpdate(user.messages)
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
      this.xmppClient.on("stanza", (stanza) => {
        if (stanza.is("presence") && stanza.attrs.type === "subscribe") {
          const from = stanza.attrs.from
          this.notifications.push({ from, type: "subscribe" })
          this.notificationListeners.forEach((callback) =>
            callback(this.notifications)
          )
        }
      })
    }
  }

  onNotificationsChange(callback) {
    this.notificationListeners.push(callback)
  }

  async acceptContactRequest(jid) {
    if (this.xmppClient) {
      const subscribedPresence = xml("presence", {
        to: jid,
        type: "subscribed",
      })

      const subscribePresence = xml("presence", {
        to: jid,
        type: "subscribe",
      })

      try {
        if (this.xmppClient.status === "online") {
          console.log("Accepting contact request")
          await this.xmppClient.send(subscribedPresence)
          console.log("Contact request accepted")

          await this.xmppClient.send(subscribePresence)
          console.log("Contact subscription confirmed")

          // Eliminar la notificación correspondiente
          this.notifications = this.notifications.filter(
            (notification) => notification.from !== jid
          )
          console.log("Updated Notifications:", this.notifications)
        }
      } catch (error) {
        console.error("Failed to accept contact request:", error)
      }
    }
  }

  async rejectContactRequest(jid) {
    if (this.xmppClient) {
      const unsubscribedPresence = xml("presence", {
        to: jid,
        type: "unsubscribed",
      })

      try {
        if (this.xmppClient.status === "online") {
          console.log("Rejecting contact request")
          await this.xmppClient.send(unsubscribedPresence)
          console.log("Contact request rejected")

          // Eliminar la notificación correspondiente
          this.notifications = this.notifications.filter(
            (notification) => notification.from !== jid
          )
          console.log("Updated Notifications:", this.notifications)
        }
      } catch (error) {
        console.error("Failed to reject contact request:", error)
      }
    }
  }
  // Setters

  // Getters
}

export default XMPPCLient
