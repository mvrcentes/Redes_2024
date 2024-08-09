"use client"

import React, { useState, useContext, useEffect } from "react"
import Sidebar from "../Sidebard/Sidebar"
import { XMPPContext } from "@/context/xmppContext"
import { xml } from "@xmpp/client"
import Conversation from "./Conversation"
import ChatView from "./ChatView"

const Chats = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [conversations, setConversations] = useState({})
  const [activeJid, setActiveJid] = useState(null)

  const sendMessage = async () => {
    xmppClientProvider.xmppClient.send(xml("presence"))
    if (xmppClientProvider.xmppClient.status === "online") {
      const message = xml(
        "message",
        {
          type: "chat",
          to: "ram21032@alumchat.lol",
          // to: "cas21700@alumchat.lol",
        },
        xml("body", {}, "hello World")
      )

      try {
        await xmppClientProvider.xmppClient.send(message)
        console.log("Message sent")
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    }
  }

  const fetchConversations = async () => {
    if (xmppClientProvider.xmppClient.status === "online") {
      xmppClientProvider.xmppClient.on("stanza", (stanza) => {
        console.log("Stanza:", stanza.toString())
        if (stanza.is("message")) {
          const from = stanza.attrs.from
          const message = stanza.getChildText("body")
          setConversations((prev) => {
            const newConversations = { ...prev }
            if (!newConversations[from]) {
              newConversations[from] = []
            }
            newConversations[from].push(message)
            return newConversations
          })
        }
      })
    }
    console.log(conversations)
  }

  useEffect(() => {
    if (xmppClientProvider) {
      console.log("xmppClientProvider:", xmppClientProvider)
      fetchConversations()
    } else {
      console.log("XMPP Client not initialized")
    }
  }, [xmppClientProvider])

  return (
    <div className="h-dvh w-full flex gap-2 bg-[#202022] p-2">
      <Sidebar />
      <div className="h-full p-6 bg-white rounded-xl w-full">
        <div className="h-full flex flex-row">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">Active Chats</h2>
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
                client={xmppClientProvider.xmppClient}
                from={activeJid}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Chats
