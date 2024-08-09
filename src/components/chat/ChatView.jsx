import React from "react"
import { Input } from "@/components/ui/input"
import classNames from "classnames"
import { xml } from "@xmpp/client"

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

const ChatView = ({ title, chats, client, from }) => {
  const [messageData, setMessageData] = React.useState("")

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage()
      setMessageData("")
    }
  }

  const sendMessage = async () => {
    if (!client) {
      console.error("XMPP client not initialized")
      return
    }

    if (client.status === "online") {
      const message = xml(
        "message",
        { type: "chat", to: title.split("/")[0] },
        xml("body", {}, messageData)
      )

      try {
        await client.send(message)
        console.log("Message sent")
      } catch (error) {
        console.error("Failed to send message:", error)
      }
    } else {
      console.error("Client is not online")
    }
  }

  return (
    <div className="flex flex-col w-full ml-8">
      <div>
        <p className="text-3xl">{title.split("/")[0]}</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto mb-4 overflow-auto">
        {chats.map((chat, index) => {
          const messages = chat.messages
          const localJid = client.jid.getLocal()

          return messages.map((message, messageIndex) => (
            <ChatMessage
              key={messageIndex}
              message={message}
              from={chat.jid}
              right={localJid === chat.jid.split("@")[0]}
            />
          ))
        })}
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
