"use client"

import React, { useEffect, useState, useContext } from "react"
import { client, xml } from "@xmpp/client"
import ContactCard from "./ContactCard"
import { XMPPContext } from "@/context/xmppContext"
import { getCookie } from "@/api/auth"

const Contacts = () => {
  const { xmppClient, setXmppClient } = useContext(XMPPContext)
  const [contacts, setContacts] = useState([])

  const tryToReconnect = async () => {
    if (xmppClient) {
      try {
        xmppClient.on("error", (err) => {
          console.error(err.message)
        })

        xmppClient.on("offline", () => {
          console.log("offline")
        })

        xmppClient.on("online", async () => {
          console.log("XMPP Online from initializeXMPP")

          // Sends presence
          await xmppClient.send(xml("presence"))

          // Requests roster
          await xmppClient.send(
            xml(
              "iq",
              { type: "get", id: "roster" },
              xml("query", { xmlns: "jabber:iq:roster" })
            )
          )
        })
      } catch (error) {
        console.error("Failed to start XMPP client:", error)
      }
    } else {
      const jid = await getCookie("jid")
      const password = await getCookie("password")
      const websocket = await getCookie("websocket")

      if (jid && password && websocket) {
        console.log("por lo menos entre al if")
        const xmpp = await client({
          service: websocket,
          username: jid,
          password: password,
        })

        await xmpp.on("error", (err) => {
          console.error(err.message)
        })

        await xmpp.on("offline", () => {
          console.log("offline")
        })

        await xmpp.on("online", async () => {
          setXmppClient(xmpp)

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

        await xmpp.start()
      }
    }
  }

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
      console.log("XMPP Online from initializeXMPP")

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

  const fetchContacts = async () => {
    if (xmppClient) {
      try {
        xmppClient.on("stanza", (stanza) => {
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
      } catch (error) {
        console.error("Failed to fetch contacts:", error)
      }
    }
  }

  useEffect(() => {
    // initializeXMPP()
    tryToReconnect()
    fetchContacts()
  }, [xmppClient, contacts])

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
