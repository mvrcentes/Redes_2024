"use client"

import React, { useContext, useEffect, useState } from "react"
import { Client, client, xml } from "@xmpp/client"
import { XMPPContext } from "@/context/xmppContext"
import { getCookie } from "@/api/auth"
import Conversation from "./Conversation"
import ChatView from "./ChatView"

interface Conversations {
  [jid: string]: string[] // JID -> Messages
}

const Chats = () => {
  const { xmppClient, setXmppClient } = useContext(XMPPContext)
  const [conversations, setConversations] = useState<Conversations>({})
  const [activeJid, setActiveJid] = useState<string | null>(null) // Estado para la conversación activa

  const initializeXMPP = async () => {
    try {
      const jid = await getCookie("jid")
      const password = await getCookie("password")
      const websocket = await getCookie("websocket")

      if (jid && password && websocket) {
        const xmpp = client({
          service: websocket,
          username: jid,
          password: password,
        })

        xmpp.on("error", (err) => {
          console.error(err.message)
        })

        xmpp.on("offline", () => {
          console.log("offline")
        })

        xmpp.on("online", async () => {
          console.log("XMPP Online")
          setXmppClient(xmpp)
          await xmpp.send(xml("presence"))
        })

        await xmpp.start()
      }
    } catch (error) {
      console.error("Failed to start XMPP client:", error)
    }
  }

  useEffect(() => {
    if (!xmppClient) {
      initializeXMPP()
    } else {
      xmppClient.on("stanza", async (stanza) => {
        if (stanza.is("message")) {
          const from = stanza.attrs.from.split("/")[0]
          const message = stanza.getChildText("body")

          console.log(stanza, "stanza")

          setConversations((prev) => {
            const newConversations = { ...prev }
            if (!newConversations[from]) {
              newConversations[from] = []
            }
            newConversations[from].push(message!)
            return newConversations
          })

          console.log(conversations, "conversations")
        }
      })
    }

    return () => {
      xmppClient?.stop()
    }
  }, [xmppClient])

  

  return (
    <div className="h-full p-6 bg-white rounded-xl w-full">
      <div className="h-full flex flex-row">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold mb-4">Active Chats</h2>
          {/* <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded">
            Send Message
          </button> */}
          {Object.keys(conversations).map((jid) => {
            const messages = conversations[jid]
            return (
              <Conversation
                key={jid}
                name={jid}
                lastMessage={messages[messages.length - 1]}
                active={jid === activeJid}
                onClick={() => setActiveJid(jid)} // Cambia el estado de la conversación activa
              />
            )
          })}
        </div>

        {
          // Si activeJid es diferente de null, se muestra el componente ChatView
          activeJid && (
            <ChatView
              title={activeJid}
              chats={[{ jid: activeJid, messages: conversations[activeJid] }]}
              client={xmppClient!}
              from={activeJid}
            />
          )
        }
      </div>
    </div>
  )
}

export default Chats
