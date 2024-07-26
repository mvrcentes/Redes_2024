"use client"
import { useEffect, useState } from "react"

import * as XMPP from "stanza"

const TestPage = () => {
  const [status, setStatus] = useState<string>("Connecting...")

  const client = XMPP.createClient({
    jid: "admin@9e1ff1f73c08",
    password: "admin",

    // If you have a .well-known/host-meta.json file for your
    // domain, the connection transport config can be skipped.
    transports: {
      websocket: "wss://localhost.com:5290/xmpp-websocket",
      // bosh: 'https://example.com:5281/http-bind'
    },
  })

  client.on("session:started", () => {
    console.log("hola")
    client.getRoster()
    client.sendPresence()
  })

  client.on("chat", (msg) => {
    client.sendMessage({
      to: msg.from,
      body: "You sent: " + msg.body,
    })
  })

  client.connect()

  useEffect(() => {}, [])

  const handleConnection = async () => {}

  return (
    <div>
      <h1>XMPP Test</h1>
      <p>Status: {status}</p>
      <button className="bg-slate-300" onClick={handleConnection}>
        Registrar Usuario
      </button>
    </div>
  )
}

export default TestPage
