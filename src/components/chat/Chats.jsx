"use client"

import React, { useState, useContext, useEffect, useCallback } from "react"
import Sidebar from "../Sidebard/Sidebar"
import { XMPPContext } from "@/context/xmppContext"
import Conversation from "./Conversation"
import ChatView from "./ChatView"

const Chats = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [conversations, setConversations] = useState({})
  const [activeJid, setActiveJid] = useState(null)

  // Función para manejar nuevas stanzas
  const handleStanza = useCallback((stanza) => {
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
  }, [])

  // Función para inicializar el cliente y obtener conversaciones
  const fetchConversations = useCallback(async () => {
    if (
      xmppClientProvider &&
      xmppClientProvider.xmppClient.status === "online"
    ) {
      xmppClientProvider.xmppClient.on("stanza", handleStanza)
    }
  }, [xmppClientProvider, handleStanza])

  // Manejar actualización de mensajes
  const handleMessagesUpdate = (updatedMessages) => {
    setConversations((prev) => ({
      ...prev,
      [activeJid]: updatedMessages,
    }))
  }

  // Efecto para inicializar el cliente XMPP y obtener conversaciones
  useEffect(() => {
    if (xmppClientProvider) {
      console.log("xmppClientProvider:", xmppClientProvider)
      fetchConversations()
      xmppClientProvider.getConversations()

    } else {
      console.log("XMPP Client not initialized")
    }

    // Cleanup function to remove event listener
    return () => {
      if (xmppClientProvider && xmppClientProvider.xmppClient) {
        xmppClientProvider.xmppClient.off("stanza", handleStanza)
      }
    }
  }, [xmppClientProvider, fetchConversations, handleStanza])

  return (
    <div className="h-dvh w-full flex gap-2 bg-[#202022] p-2">
      <Sidebar />
      <div className="h-full p-6 bg-white rounded-xl w-full">
        <div className="h-full flex flex-row">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold mb-4">Active Chats</h2>
            {xmppClientProvider &&
              xmppClientProvider.users.map((user, index) => {
                // console.log("User:", user)
                return (
                  <Conversation
                    key={index}
                    user={user}
                    active={user.jid === activeJid}
                    onClick={() => setActiveJid(user.jid)} // Cambia el estado de la conversación activa
                  />
                )
              })}
          </div>

          {
            // Si activeJid es diferente de null, se muestra el componente ChatView
            activeJid && xmppClientProvider && (
              <ChatView
                title={activeJid}
                client={xmppClientProvider}
                from={activeJid}
                onMessagesUpdate={handleMessagesUpdate}
              />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Chats
