"use client"

import React, { useState, useContext, useEffect, useCallback } from "react"
import Sidebar from "../Sidebard/Sidebar"
import { XMPPContext } from "@/context/xmppContext"
import Conversation from "./Conversation"
import ChatView from "./ChatView"
import SendMessage from "./SendMessage"

const Chats = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [conversations, setConversations] = useState({})
  const [activeId, setActiveId] = useState(null)

  const handleStanza = useCallback((stanza) => {
    if (stanza.is("message")) {
      const type = stanza.attrs.type
      const from = stanza.attrs.from.split("/")[0] // JID base sin recurso
      const message = stanza.getChildText("body") || ""
      const subject = stanza.getChildText("subject") || from // Usar el subject o el JID

      setConversations((prev) => {
        const newConversations = { ...prev }
        const key = type === "groupchat" ? subject : from

        if (!newConversations[key]) {
          newConversations[key] = []
        }
        newConversations[key].push({ message, from })

        return newConversations
      })
    }
  }, [])

  const fetchConversations = useCallback(async () => {
    if (
      xmppClientProvider &&
      xmppClientProvider.xmppClient.status === "online"
    ) {
      xmppClientProvider.xmppClient.on("stanza", handleStanza)
    }
  }, [xmppClientProvider, handleStanza])

  const handleMessagesUpdate = (updatedMessages) => {
    setConversations((prev) => ({
      ...prev,
      [activeId]: updatedMessages,
    }))
  }

  useEffect(() => {
    if (xmppClientProvider) {
      fetchConversations()
      xmppClientProvider.getConversations()
    }

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
          <div className="flex flex-col min-w-[300px]">
            <div className="flex flex-row items-center">
              <h2 className="text-xl font-bold">Active Chats</h2>
              <SendMessage />
            </div>
            {Object.keys(conversations).map((id, index) => (
              <Conversation
                key={index}
                title={id} // Pasamos el subject o JID como título
                active={id === activeId}
                onClick={() => setActiveId(id)} // Cambia el estado de la conversación activa
                lastMessage={conversations[id][conversations[id].length - 1]} // Último mensaje
              />
            ))}
          </div>

          {activeId && xmppClientProvider && (
            <ChatView
              title={activeId} // Aquí se mostrará el subject o JID como título
              client={xmppClientProvider}
              messages={conversations[activeId]} // Pasar mensajes actuales
              onMessagesUpdate={handleMessagesUpdate}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Chats
