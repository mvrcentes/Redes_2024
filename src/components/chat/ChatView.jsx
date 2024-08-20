import React, { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import ProfileInformation from "./ProfileInformation"
import ChatMessage from "./ChatMessage"

const ChatView = ({ title, client, messages = [], onMessagesUpdate }) => {
  const [messageData, setMessageData] = useState("")

  // Función para enviar mensajes
  const sendMessage = useCallback(async () => {
    let messageToSend = messageData.trim()

    if (messageToSend !== "") {
      // Determina si el mensaje es para un grupo o un chat individual
      const isGroupChat = title.includes("@muc.") // Detecta si el JID es de un grupo basado en el sufijo típico de MUC

      // Enviar el mensaje usando la función del cliente XMPP
      await client.sendMessage(title.split("/")[0], messageToSend, isGroupChat)

      const newMessage = {
        message: messageToSend,
        from: client.xmppClient.jid.toString(),
      }

      // Actualiza los mensajes en el estado
      onMessagesUpdate([...messages, newMessage])

      // Limpiar el input
      setMessageData("")
    }
  }, [client, title, messageData, messages, onMessagesUpdate])

  // Función para manejar la tecla Enter para enviar el mensaje
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        sendMessage()
      }
    },
    [sendMessage]
  )

  return (
    <div className="flex flex-col w-full ml-8">
      <div className="flex w-full">
        <p className="text-3xl">{title}</p>
        <ProfileInformation className="ml-auto" user={{ jid: title }} />
      </div>

      <div className="flex flex-col gap-2 mt-auto mb-4 overflow-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.message}
            from={message.from}
            right={message.from === client.xmppClient.jid.toString()}
          />
        ))}
      </div>

      <div className="flex flex-row bg-[#eeeef8] p-2 items-center">
        <Input
          placeholder="Type a message"
          onChange={(e) => setMessageData(e.target.value)}
          value={messageData}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none focus-visible:border-transparent focus-visible:ring-0 flex-grow"
        />
        <Send
          className="mr-2 cursor-pointer"
          color="#898787"
          onClick={sendMessage}
        />
      </div>
    </div>
  )
}

export default ChatView
