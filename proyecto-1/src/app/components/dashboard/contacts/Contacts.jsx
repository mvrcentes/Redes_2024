"use client"

import React, { useEffect, useState } from "react"
import { client, xml } from "@xmpp/client"
import ContactCard from "./ContactCard"

const Contacts = () => {
  const [contacts, setContacts] = useState([])

  const initializeXMPP = async () => {
    const xmpp = client({
      service: "wss://tigase.im:5291/xmpp-websocket",
      domain: "tigase.im",
      resource: "example",
      username: "ram21032",
      password: "ram21032",
    })

    xmpp.on("error", (err) => {
      console.error("XMPP Error:", err)
    })

    xmpp.on("offline", () => {
      console.log("XMPP Offline")
    })

    xmpp.on("online", async () => {
      console.log("XMPP Online")

      // Sends presence
      await xmpp.send(xml("presence"))

      // Requests roster
      await xmpp.send(
        xml(
          "iq",
          { type: "get", id: "roster" },
          xml("query", { xmlns: "jabber:iq:roster" })
        )
      )
    })

    xmpp.on("stanza", (stanza) => {
      if (
        stanza.is("iq") &&
        stanza.attrs.type === "result" &&
        stanza.attrs.id === "roster"
      ) {
        const roster = stanza.getChild("query", "jabber:iq:roster")
        if (roster) {
          const newContacts = roster.children.map((contact) => ({
            jid: contact.attrs.jid,
            name: contact.getChildText("name") || contact.attrs.jid,
          }))
          setContacts(newContacts)
        } else {
          console.log("No roster information found")
        }
      }
    })

    try {
      await xmpp.start()
    } catch (error) {
      console.error("Failed to start XMPP client:", error)
    }

    // Clean up the connection when the component unmounts
    return () => {
      xmpp.stop().catch(console.error)
    }
  }

  useEffect(() => {
    initializeXMPP()
  }, []) // Runs only once on mount

  console.log(contacts, "contactssssss")

  return (
    <div className="bg-white h-full w-full rounded-[40px] p-6">
      {contacts.map((contact) => (
        <ContactCard key={contact.jid} jid={contact.jid} name={contact.name} />
      ))}
    </div>
  )
}

export default Contacts
