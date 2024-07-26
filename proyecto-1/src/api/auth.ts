import * as XMPP from "stanza"

import { Register } from "@/lib/types"

export const client = XMPP.createClient({
  jid: "echobot@example.com",
  password: "hunter2",

  // If you have a .well-known/host-meta.json file for your
  // domain, the connection transport config can be skipped.
  transports: {
    websocket: "wss://example.com:5281/xmpp-websocket",
    bosh: "https://example.com:5281/http-bind",
  },
})

client.on("session:started", () => {
  client.getRoster()
  client.sendPresence()
})
