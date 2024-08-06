import React from "react"
import { Input } from "@/components/ui/input"
import { Client, xml } from "@xmpp/client"
import classNames from "classnames"

type Chat = {
  jid: string
  messages: string[]
}

interface ChatViewProps {
  title: string
  chats?: any
  client?: Client
}

const ChatMessage = ({ message, from, right }: { message: string; from?: string, right?:boolean }) => {

  return (
    <div className={classNames({
      "flex flex-row gap-2": true,
      "self-end": right
    })}>
      <div className="w-8 h-8 bg-gray-400 rounded-sm self-end text-center uppercase p-1">{from![0]}</div>
      <div className="p-2 bg-[#eeeef8] rounded-md">
        <p>{message}</p>
      </div>
    </div>
  )
}

const ChatView = ({ title, chats, client }: ChatViewProps) => {
  const [messageData, setMessageData] = React.useState("")

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      sendMessage()
      console.log(messageData)
      setMessageData("")
    }
  }

  const sendMessage = async () => {
    if (!client) {
      console.error("XMPP client not initialized")
      return
    }

    if (client.status === "online") {
      console.log(client.jid?.getLocal())
      console.log("Sending message")
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

      <div className="flex flex-col gap-2 mt-auto mb-4">
        {chats.map((chat: Chat) => {

          return chat.messages.map((message: string, index: number) => {

            return <ChatMessage key={index} message={message} from={chat.jid}/>
          })
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
