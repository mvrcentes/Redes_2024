import React, { useState, useEffect, useCallback, useMemo } from "react"
import { Input } from "@/components/ui/input"
import classNames from "classnames"
import Image from "next/image"
import { Send } from "lucide-react"
import ProfileInformation from "./ProfileInformation"
import InputFileImage from "../reusable/InputFileImage"
import ChatMessage from "./ChatMessage"

const ChatView = ({ title, client, onMessagesUpdate }) => {
  const [messageData, setMessageData] = useState("")
  const [messages, setMessages] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)

  const sendMessage = useCallback(async () => {
    let messageToSend = messageData

    // if (selectedFile) {
    //   try {
    //     const fileUrl = await client.uploadFileToServer(selectedFile)
    //     messageToSend = fileUrl
    //     setMessages((prevMessages) => [
    //       ...prevMessages,
    //       { message: fileUrl, from: client.xmppClient.jid.getLocal() },
    //     ])
    //   } catch (error) {
    //     console.error("Failed to upload file:", error)
    //     return
    //   }
    // }

    if (messageToSend.trim() !== "") {
      client.sendMessage(title.split("/")[0], messageToSend)
      setMessages((prevMessages) => [
        ...prevMessages,
        { message: messageToSend, from: client.xmppClient.jid.getLocal() },
      ])
    }

    setMessageData("")
    setSelectedFile(null)

    if (onMessagesUpdate) {
      onMessagesUpdate([
        ...messages,
        {
          message: messageToSend,
          from: client.xmppClient.jid.getLocal(),
        },
      ])
    }
  }, [client, title, messageData, messages, selectedFile, onMessagesUpdate])

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        sendMessage()
      }
    },
    [sendMessage]
  )

  const user = useMemo(
    () => client.users.find((user) => user.jid === title),
    [title, client.users]
  )

  useEffect(() => {
    if (user) {
      setMessages(user.messages)
    }
  }, [user])

  return (
    <div className="flex flex-col w-full ml-8">
      <div className="flex w-full">
        <p className="text-3xl">{title.split("/")[0]}</p>
        <ProfileInformation className="ml-auto" user={user} />
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

      {selectedFile && (
        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md mb-2">
          <span className="text-sm text-gray-500">{selectedFile.name}</span>
        </div>
      )}

      <div className="flex flex-row bg-[#eeeef8] p-2 items-center">
        <InputFileImage onChange={setSelectedFile} />
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
