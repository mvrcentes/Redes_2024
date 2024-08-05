"use client"
import { useEffect, useState } from "react"
import * as XMPP from "stanza"
import { any } from "zod"
const { client, xml, jid } = require("@xmpp/client")

const NewTest = () => {
  const [status, setStatus] = useState("Disconnected")
  const [client, setClient] = useState(null)

  // useEffect(() => {

  // }, [client])

  const handleConnect = async () => {
    const xmpp = client({
      service: "wss://tigase.im:5291/xmpp-websocket",
      domain: "tigase.im",
      resource: "mvr",
      username: "ram21032",
      // username: "ram21032@alumchat.lol",
      password: "ram21032",
    })

    console.log(xmpp, "cliente")

    setClient(xmpp)

    client.on("online", async (address) => {
      // Makes itself available
      await xmpp.send(xml("presence"))
    })

    console.log(client.status, "aquiiii")
  }

  const handleCheckStatus = () => {}

  const sendMessage = async () => {
    const message = xml(
      "message",
      { type: "chat", to: address },
      xml("body", {}, "hello world")
    )
    await xmpp.send(message)
  }

  return (
    <div>
      <h1>XMPP NewTest</h1>
      <p>Status: {status}</p>
      <button className="bg-slate-300" onClick={handleConnect}>
        Connect
      </button>
      <button className="ml-10 bg-slate-300" onClick={handleCheckStatus}>
        Check Status
      </button>

      <button className="ml-10 bg-slate-300" onClick={sendMessage}>
        Send Message
      </button>
    </div>
  )
}

export default NewTest
