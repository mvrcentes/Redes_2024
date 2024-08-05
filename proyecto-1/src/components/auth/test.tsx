"use client"
import { useEffect, useState } from "react"
import { client, xml } from "@xmpp/client"

const TestPage = () => {
  const [status, setStatus] = useState<string>("Disconnected")
  const [data, setClient] = useState<any>(null)

  const handleConnect = () => {
    const xmpp = client({
      service: "wss://tigase.im:5291/xmpp-websocket",
      domain: "tigase.im",
      resource: "example",
      username: "ram21032",
      password: "ram21032",
    })


    xmpp.on("error", (err: any) => {
      console.error(err)
    })

    xmpp.on("offline", () => {
      console.log("offline")
    })


    xmpp.on("online", async () => {
      console.log("online")
      setClient(xmpp)
      // Makes itself available
      await xmpp.send(xml("presence"))

      const message = xml(
        "message",
        { type: "chat", to: "example" },
        xml("body", {}, "hello world")
      )
      await xmpp.send(message)
    })

    xmpp.start().catch(console.error)
  }

  const handleCheckStatus = () => {
    console.log("handleCheckStatus")

    console.log(client, "clienteee")
    if (client) {
      const state = client?.connected ? "Connected" : "Disconnected"

      client.on("session:started", () => {
        client.getRoster()
        client.sendPresence()
      })
    } else {
      setStatus("Client not initialized")
    }
  }

  // const sendMessage = () => {
  //   console.log("sendMessage", client)
  //   if (client) {
  //     client.sendMessage({
  //       to: "example",
  //       body: "You sent: " + "prueba",
  //     })

  //     console.log("si lo mande")
  //   }
  // }

  

  return (
    <div>
      <h1>XMPP Test</h1>
      <p>Status: {status}</p>
      <button className="bg-slate-300" onClick={handleConnect}>
        Connect
      </button>
      <button className="ml-10 bg-slate-300" onClick={handleCheckStatus}>
        Check Status
      </button>

      {/* <button className="ml-10 bg-slate-300" onClick={sendMessage}>
        Send Message
      </button> */}
    </div>
  )
}

export default TestPage
