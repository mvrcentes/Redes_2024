import React, { useState, useEffect, useCallback } from "react"
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

  // Optimización de la función de manejo de eventos
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        client.sendMessage(title.split("/")[0], messageData)
        setMessageData("")
      }
    },
    [client, title, messageData]
  )

  useEffect(() => {
    // Obtener usuario solo cuando title o client.users cambien
    const user = client.users.find((user) => user.jid === title)
    if (user) {
      setMessages(user.messages)
      if (onMessagesUpdate) {
        onMessagesUpdate(user.messages)
      }
    }
  }, [title, client.users, onMessagesUpdate]) // Asegúrate de que estas dependencias no cambien en cada renderizado

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
