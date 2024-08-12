import React, { useState, useEffect } from "react"
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

const ChatView = ({ title, client, from }) => {
  const [messageData, setMessageData] = React.useState("")
  const [messages, setMessages] = useState([])

  // const handleKeyDown = (event) => {
  //   if (event.key === "Enter") {
  //     client.sendMessage(title.split("/")[0], messageData)
  //     setMessageData("")
  //   }
  // }

  const user = client.users.find((user) => user.jid === title)

  useEffect(() => {
    const user = client.users.find((user) => user.jid === title)
    if (user) {
      setMessages(user.messages)
    }
  }, [title, client.users])

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      client.sendMessage(title.split("/")[0], messageData)
      setMessageData("")
    }
  }

  return (
    <div className="flex flex-col w-full ml-8">
      <div>
        <p className="text-3xl">{title.split("/")[0]}</p>
      </div>

      <div className="flex flex-col gap-2 mt-auto mb-4 overflow-auto">
        {
          // Si user es diferente de undefined, se muestra el historial de mensajes
          user &&
            user.messages.map((message, index) => {
              return (
                <ChatMessage
                  key={index}
                  message={message.message}
                  from={message.from}
                  right={
                    message.from.split("@")[0] ===
                    client.xmppClient.jid.getLocal()
                  }
                />
              )
            })
        }
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
