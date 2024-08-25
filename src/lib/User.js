class User {
  constructor(name) {
    this.jid = name // The JID (Jabber ID) or username of the user
    this.status = "" // A status message or custom status text
    this.messages = [] // An array to store the user's messages
    this.show = "unavailable" // The user's presence state (e.g., available, unavailable)
  }
}

export default User
