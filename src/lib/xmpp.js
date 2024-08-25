import { client, xml } from "@xmpp/client"
import { setCookie, destroyCookie, parseCookies } from "nookies"
import axios from "axios"
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
    this.presenceStatuses = {}
    this.contacts = []
    this.isStanzaListenerAdded = false
  }

  async initialize() {
    const cookies = parseCookies()
    if (!this.service || !this.username || !this.password) {
      this.service = cookies.service || this.service
      this.username = cookies.username || this.username
      this.password = cookies.password || this.password
    }

    if (!this.service || !this.username || !this.password) {
      console.error("No credentials provided and none found in cookies.")
      return
    }

    if (this.xmppClient) {
      await this.xmppClient.stop().catch(console.error)
    }

    this.xmppClient = client({
      service: this.service,
      resource: "web",
      username: this.username,
      password: this.password,
    })

    this.xmppClient.on("error", (err) => console.log(err))
    this.xmppClient.on("offline", () => console.log("offline"))
    this.xmppClient.on("online", async () => {
      const token = "authenticated"

      setCookie(null, "token", token, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
      setCookie(null, "jid", this.username, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
      setCookie(null, "password", this.password, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })
      setCookie(null, "service", this.service, {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      })

      await this.handlePresenceUpdates()

      if (!this.isStanzaListenerAdded) {
        this.xmppClient.on("stanza", (stanza) => this.handleStanza(stanza))
        this.isStanzaListenerAdded = true
      }

      await this.xmppClient.send(xml("presence"))
    })

    try {
      await this.xmppClient.start()
      console.log("XMPP Client started")
    } catch (error) {
      console.error("Failed to start XMPP Client:", error)
    }
  }

  async getRoster() {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    return new Promise((resolve, reject) => {
      try {
        const iq = xml(
          "iq",
          { type: "get", id: "roster_1" },
          xml("query", "jabber:iq:roster")
        )
        this.xmppClient.send(iq)

        this.xmppClient.on("stanza", (stanza) => {
          if (stanza.is("iq") && stanza.attrs.type === "result") {
            const query = stanza.getChild("query", "jabber:iq:roster")
            if (query) {
              const items = query.getChildren("item")
              this.contacts = items.map((item) => {
                const jid = item.attrs.jid

                let contact = this.contacts.find((c) => c.jid === jid)
                if (!contact) {
                  contact = new User(jid)
                  this.contacts.push(contact)
                }
                return contact
              })
              resolve(this.contacts)
              this.notifyContactsUpdate()
            }
          }
        })
      } catch (error) {
        console.error("Failed to get roster:", error)
        reject(error)
      }
    })
  }

  async handlePresenceUpdates() {
    this.xmppClient.on("stanza", (stanza) => {
      console.log(stanza.toString(), `from ${this.xmppClient.jid.getLocal()}`)
      if (stanza.is("presence")) {
        const from = stanza.attrs.from
        const type = stanza.attrs.type || "available" // Si no hay un tipo, se asume que es "available"
        const status = stanza.getChildText("status") || ""
        let show = stanza.getChildText("show") || ""

        let contact = this.contacts.find(
          (user) => user.jid === from.split("/")[0]
        )

        if (!contact) {
          this.contacts.push(new User(from.split("/")[0]))
          return
        }

        contact = this.contacts.find((user) => user.jid === from.split("/")[0])

        if (
          show === "chat" ||
          type === "available" ||
          stanza.name === "presence"
        ) {
          console.log(
            `funciono con la stanza desde ${this.xmppClient.jid.getLocal()}`,
            stanza.toString()
          )
          show = "available"
          this.notifications.push({
            from,
            type: "presence",
            message: `${from} is online`,
          })
          this.notifyNotificationChange()
        }

        if (type === "unavailable") {
          show = "unavailable"
          this.notifications.push({
            from,
            type: "presence",
            message: `${from} is offline`,
          })
          this.notifyNotificationChange()
        }

        const idle = stanza.getChild("idle", "urn:xmpp:idle:1")
        if (idle) {
          show = "idle"
          this.notifications.push({
            from,
            type: "presence",
            message: `${from} is idle`,
          })
          this.notifyNotificationChange()
        }

        if (contact) {
          contact.status = status
          contact.show = show
          this.notifyContactsUpdate()
        }
      }
    })
  }

  // Notificar a los listeners que hay una nueva notificación
  notifyNotificationChange() {
    this.notificationListeners.forEach((callback) =>
      callback(this.notifications)
    )
  }

  // Notifica a los listeners que los contactos han sido actualizados
  notifyContactsUpdate() {
    this.notificationListeners.forEach((callback) => callback(this.contacts))
  }

  setContactsUpdateListener(callback) {
    this.notificationListeners.push(callback)
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
          if (stanza.is("message") && stanza.attrs.type === "groupchat") {
            const subject = stanza.getChildText("subject") || "No Subject"
            const message = stanza.getChildText("body")
            const roomJid = stanza.attrs.from.split("/")[0]

            let chat = this.users.find((user) => user.subject === subject)

            if (!chat) {
              chat = new User(roomJid)
              chat.subject = subject
              this.users.push(chat)
            }

            if (message) {
              chat.messages.push({
                message,
                from: roomJid,
              })
            }

            console.log(this.users)
          }
        })
      } catch (error) {
        console.error("Failed to get conversations:", error)
      }
    }
  }

  async sendMessage(jid, messageData, isGroupChat = false) {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    if (this.xmppClient.status === "online") {
      const message = xml(
        "message",
        { type: isGroupChat ? "groupchat" : "chat", to: jid },
        xml("body", {}, messageData)
      )

      try {
        await this.xmppClient.send(message)
        console.log("Message sent:", messageData)

        let to = this.users.find((user) => user.jid === jid)
        if (!to) {
          to = new User(jid)
          this.users.push(to)
        }
        to.messages.push({
          message: messageData,
          from: this.xmppClient.jid.toString(),
        })

        this.notifyUserUpdate(jid)
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
    console.log(jid)

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

          console.log("funcione")
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

  async setPresence(presence) {
    if (this.xmppClient) {
      const presenceStanza = xml("presence", {}, xml("status", {}, presence))

      try {
        if (this.xmppClient.status === "online") {
          console.log("Setting presence")
          await this.xmppClient.send(presenceStanza)
          console.log("Presence set")
        }
      } catch (error) {
        console.error("Failed to set presence:", error)
      }
    }
  }

  async uploadFileToServer(file) {
    console.log(file)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data = await response.json()
      if (data.url) {
        console.log("File uploaded successfully:", data.url)
        return data.url
      } else {
        throw new Error("No URL returned from upload")
      }
    } catch (error) {
      console.error("Failed to upload file:", error)
      throw error
    }
  }

  async removeContact(jid) {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    try {
      // Crear la solicitud IQ para eliminar el contacto
      const iq = xml(
        "iq",
        { type: "set", id: "remove_1" },
        xml(
          "query",
          { xmlns: "jabber:iq:roster" },
          xml("item", { jid: jid, subscription: "remove" })
        )
      )

      // Enviar la solicitud al servidor
      await this.sendIq(iq)
      console.log(`Contact ${jid} removed from roster`)

      // Actualizar la lista de contactos localmente
      this.contacts = this.contacts.filter((contact) => contact.jid !== jid)
      this.notifyContactsUpdate() // Notificar a los listeners que los contactos han sido actualizados
    } catch (error) {
      console.error(`Failed to remove contact ${jid}:`, error)
    }
  }

  async removeContact(jid) {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    try {
      // Crear la solicitud IQ para eliminar el contacto
      const iq = xml(
        "iq",
        { type: "set", id: "remove_1" },
        xml(
          "query",
          { xmlns: "jabber:iq:roster" },
          xml("item", { jid: jid, subscription: "remove" })
        )
      )

      // Enviar la solicitud al servidor
      await this.sendIq(iq)
      console.log(`Contact ${jid} removed from roster`)

      // Actualizar la lista de contactos localmente
      this.contacts = this.contacts.filter((contact) => contact.jid !== jid)
      this.notifyContactsUpdate() // Notificar a los listeners que los contactos han sido actualizados
    } catch (error) {
      console.error(`Failed to remove contact ${jid}:`, error)
    }
  }

  sendIq(iq) {
    return new Promise((resolve, reject) => {
      this.xmppClient.send(iq)
      this.xmppClient.on("stanza", (stanza) => {
        if (stanza.is("iq") && stanza.attrs.type === "result") {
          resolve(stanza)
        } else if (stanza.is("iq") && stanza.attrs.type === "error") {
          reject(new Error("Error response from server"))
        }
      })
    })
  }

  async acceptGroupChatInvite(roomJid, inviterJid) {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    try {
      const presence = xml(
        "presence",
        { to: roomJid + "/" + this.username },
        xml("x", { xmlns: "http://jabber.org/protocol/muc" })
      )

      await this.xmppClient.send(presence)
      console.log(`Joined the group chat: ${roomJid}`)

      // Eliminar la notificación correspondiente
      this.notifications = this.notifications.filter(
        (notification) =>
          !(
            notification.from === roomJid && notification.inviter === inviterJid
          )
      )
      this.notifyNotificationChange() // Notificar cambios en las notificaciones
    } catch (error) {
      console.error("Failed to accept group chat invite:", error)
    }
  }

  async rejectGroupChatInvite(roomJid, inviterJid) {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    try {
      const message = xml(
        "message",
        { to: roomJid, type: "normal" },
        xml("x", { xmlns: "http://jabber.org/protocol/muc#user" }),
        xml("decline", { to: inviterJid })
      )

      await this.xmppClient.send(message)
      console.log(`Declined the group chat invite from ${inviterJid}`)

      // Eliminar la notificación correspondiente
      this.notifications = this.notifications.filter(
        (notification) =>
          !(
            notification.from === roomJid && notification.inviter === inviterJid
          )
      )
      this.notifyNotificationChange() // Notificar cambios en las notificaciones
    } catch (error) {
      console.error("Failed to decline group chat invite:", error)
    }
  }

  // Manejar la recepción de invitaciones a chat grupal
  handleStanza(stanza) {
    console.log("Incoming stanza:", stanza.toString())

    if (stanza.is("message") && stanza.attrs.type === "groupchat") {
      const from = stanza.attrs.from.split("/")[0]
      const message = stanza.getChildText("body") || ""
      const subject = stanza.getChildText("subject") || from

      let chat = this.users.find((user) => user.jid === from)

      if (!chat) {
        chat = new User(from)
        chat.subject = subject
        this.users.push(chat)
      }

      // Evitar agregar mensajes duplicados
      const existingMessage = chat.messages.find(
        (msg) => msg.message === message && msg.from === stanza.attrs.from
      )

      if (!existingMessage && message) {
        chat.messages.push({
          message,
          from: stanza.attrs.from,
        })
        console.log("Updated users with group chat messages:", this.users)
        this.notifyUserUpdate(from)
      }
    }

    const invite = stanza
      .getChild("x", "http://jabber.org/protocol/muc#user")
      ?.getChild("invite")
    if (invite) {
      const roomJid = stanza.attrs.from
      const inviterJid = invite.attrs.from

      this.notifications.push({
        type: "groupchat-invite",
        from: roomJid,
        inviter: inviterJid,
        subject: stanza.getChildText("subject") || "No Subject",
        message: `${inviterJid} te ha invitado al grupo ${roomJid}`,
      })

      this.notifyNotificationChange()
    }
  }

  async logout() {
    if (this.xmppClient) {
      await this.xmppClient.stop()
      destroyCookie(null, "token")
      destroyCookie(null, "jid")
      destroyCookie(null, "password")
      destroyCookie(null, "service")
      console.log("Logged out and cookies removed")
    }
  }

  async deleteAccount() {
    if (!this.xmppClient) {
      console.error("XMPP client not initialized")
      return
    }

    // Verificar si el cliente está conectado y listo
    if (this.xmppClient.status !== "online") {
      console.error("Client is not online")
      return
    }

    return new Promise((resolve, reject) => {
      try {
        const iq = xml(
          "iq",
          { type: "set", id: "delete_account" },
          xml("query", { xmlns: "jabber:iq:register" }, xml("remove"))
        )

        this.xmppClient.send(iq)

        destroyCookie(null, "token")
        destroyCookie(null, "jid")
        destroyCookie(null, "password")
        destroyCookie(null, "service")

        this.xmppClient.on("stanza", (stanza) => {
          if (stanza.is("iq") && stanza.attrs.type === "result") {
            console.log("Account deletion successful")
            resolve("Account deletion successful")
          } else if (stanza.is("iq") && stanza.attrs.type === "error") {
            console.error("Account deletion failed", stanza)
            reject(new Error("Account deletion failed"))
          }
        })
      } catch (error) {
        console.error("Failed to delete account:", error)
        reject(error)
      }
    })
  }
}

export default XMPPCLient
