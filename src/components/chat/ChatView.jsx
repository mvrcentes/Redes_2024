import React, { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import ProfileInformation from "./ProfileInformation"
import ChatMessage from "./ChatMessage"

const ChatView = ({ title, client, messages = [], onMessagesUpdate }) => {
  // State to manage the current message being typed
  const [messageData, setMessageData] = useState("")

  // Function to send messages
  const sendMessage = useCallback(async () => {
    let messageToSend = messageData.trim() // Remove whitespace from the message

    if (messageToSend !== "") {
      // Determine if the message is for a group chat based on the JID
      const isGroupChat = title.includes("@muc.") // Detects if the JID belongs to a group based on typical MUC (Multi-User Chat) suffix

      // Send the message using the XMPP client's sendMessage function
      await client.sendMessage(title.split("/")[0], messageToSend, isGroupChat)

      // Create a new message object
      const newMessage = {
        message: messageToSend,
        from: client.xmppClient.jid.toString(), // The sender's JID
      }

      // Update the message list by adding the new message
      onMessagesUpdate([...messages, newMessage])

      // Clear the input field
      setMessageData("")
    }
  }, [client, title, messageData, messages, onMessagesUpdate])

  // Function to handle Enter key press for sending a message
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        sendMessage() // Trigger the sendMessage function when Enter is pressed
      }
    },
    [sendMessage]
  )

  return (
    <div className="flex flex-col w-full ml-8">
      {/* Header displaying the chat title and user profile information */}
      <div className="flex w-full">
        <p className="text-3xl">{title}</p>
        <ProfileInformation className="ml-auto" user={{ jid: title }} />
      </div>

      {/* Displaying the list of chat messages */}
      <div className="flex flex-col gap-2 mt-auto mb-4 overflow-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={index} // Unique key for each message
            message={message.message} // The actual message text
            from={message.from} // The sender's JID
            right={message.from === client.xmppClient.jid.toString()} // Align message to the right if it's from the current user
          />
        ))}
      </div>

      {/* Input field for typing new messages */}
      <div className="flex flex-row bg-[#eeeef8] p-2 items-center">
        <Input
          placeholder="Type a message"
          onChange={(e) => setMessageData(e.target.value)} // Update the messageData state with the input value
          value={messageData} // Bind the input value to the messageData state
          onKeyDown={handleKeyDown} // Handle Enter key press to send the message
          className="bg-transparent border-none focus-visible:border-transparent focus-visible:ring-0 flex-grow"
        />
        <Send
          className="mr-2 cursor-pointer"
          color="#898787"
          onClick={sendMessage} // Trigger the sendMessage function when the send icon is clicked
        />
      </div>
    </div>
  )
}

export default ChatView
