"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import classNames from "classnames"

const ChatMessage = ({ message, from, right }) => {
  return (
    <div
      className={classNames({
        "flex flex-row gap-2": true,
        "self-end": right,
      })}>
      <div className="w-8 h-8 bg-gray-400 rounded-sm self-end text-center uppercase p-1">
        {from[0]}
      </div>
      <div className="p-2 bg-[#eeeef8] rounded-md">
        <p>{message}</p>
      </div>
    </div>
  )
}

const ChatView = ({ title, client, from, onMessagesUpdate }) => {
  const [messageData, setMessageData] = useState("")
  const [messages, setMessages] = useState([])

  // Memorizar la función de manejo de eventos
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && messageData.trim() !== "") {
        client.sendMessage(title.split("/")[0], messageData)
        setMessageData("")
      }
    },
    [client, title, messageData]
  )

  // Memorizar el usuario seleccionado
  const user = useMemo(
    () => client.users.find((user) => user.jid === title),
    [title, client.users]
  )

  useEffect(() => {
    if (user) {
      setMessages(user.messages)
      if (onMessagesUpdate) {
        onMessagesUpdate(user.messages)
      }
    }
  }, [user, onMessagesUpdate])

  useEffect(() => {
    const handleNewMessage = (stanza) => {
      if (stanza.is("message")) {
        const from = stanza.attrs.from
        const message = stanza.getChildText("body")
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages, { message, from }]
          if (onMessagesUpdate) {
            onMessagesUpdate(updatedMessages)
          }
          return updatedMessages
        })
      }
    }

    if (client) {
      client.xmppClient.on("stanza", handleNewMessage)
    }

    return () => {
      if (client) {
        client.xmppClient.off("stanza", handleNewMessage)
      }
    }
  }, [client, onMessagesUpdate])

  return (
    <div className="flex flex-col w-full ml-8">
      <div>
        <p className="text-3xl">{title.split("/")[0]}</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto mb-4 overflow-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            from={message.from}
            right={
              message.from.split("@")[0] === client.xmppClient.jid.getLocal()
            }
          />
        ))}
      </div>

      <div>
        <Input
          placeholder="Type a message"
          onChange={(e) => setMessageData(e.target.value)}
          value={messageData}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}

export default ChatView
