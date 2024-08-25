"use client"

import React, { useState, useContext, useEffect, useCallback } from "react"
import Sidebar from "../Sidebard/Sidebar"
import { XMPPContext } from "@/context/xmppContext"
import Conversation from "./Conversation"
import ChatView from "./ChatView"
import SendMessage from "./SendMessage"

const Chats = () => {
  // Extracting XMPP client provider from context
  const { xmppClientProvider } = useContext(XMPPContext)

  // State to store conversations, using a dictionary structure where keys are JIDs or subjects
  const [conversations, setConversations] = useState({})

  // State to track the currently active chat ID (JID or subject)
  const [activeId, setActiveId] = useState(null)

  // Callback function to handle incoming XMPP stanzas (messages)
  const handleStanza = useCallback((stanza) => {
    if (stanza.is("message")) {
      const type = stanza.attrs.type // Type of the message (e.g., 'chat', 'groupchat')
      const from = stanza.attrs.from.split("/")[0] // Extract the base JID without resource
      const message = stanza.getChildText("body") || "" // Get the message body, or use an empty string if not available
      const subject = stanza.getChildText("subject") || from // Use the subject if available, otherwise use the base JID

      setConversations((prev) => {
        const newConversations = { ...prev }
        const key = type === "groupchat" ? subject : from // Use subject as key for group chats, otherwise use JID

        if (!newConversations[key]) {
          newConversations[key] = [] // Initialize the conversation array if it doesn't exist
        }
        newConversations[key].push({ message, from }) // Add the new message to the conversation

        return newConversations
      })
    }
  }, [])

  // Function to start fetching conversations by setting up XMPP stanza listeners
  const fetchConversations = useCallback(async () => {
    if (
      xmppClientProvider &&
      xmppClientProvider.xmppClient.status === "online" // Check if the XMPP client is online
    ) {
      xmppClientProvider.xmppClient.on("stanza", handleStanza) // Add a listener for incoming stanzas
    }
  }, [xmppClientProvider, handleStanza])

  // Update function for when messages are modified within a conversation
  const handleMessagesUpdate = (updatedMessages) => {
    setConversations((prev) => ({
      ...prev,
      [activeId]: updatedMessages, // Update the conversation of the currently active chat
    }))
  }

  // Effect to initialize and clean up the XMPP stanza listeners
  useEffect(() => {
    if (xmppClientProvider) {
      fetchConversations() // Start fetching conversations when the component mounts
      xmppClientProvider.getConversations() // Optional: Fetch existing conversations (implementation-specific)
    }

    return () => {
      if (xmppClientProvider && xmppClientProvider.xmppClient) {
        xmppClientProvider.xmppClient.off("stanza", handleStanza) // Clean up the stanza listener when the component unmounts
      }
    }
  }, [xmppClientProvider, fetchConversations, handleStanza])

  return (
    <div className="h-dvh w-full flex gap-2 bg-[#202022] p-2">
      <Sidebar /> {/* Sidebar component for navigation or additional options */}
      <div className="h-full p-6 bg-white rounded-xl w-full">
        <div className="h-full flex flex-row">
          <div className="flex flex-col min-w-[300px]">
            <div className="flex flex-row items-center">
              <h2 className="text-xl font-bold">Active Chats</h2>
              <SendMessage /> {/* Component to send new messages */}
            </div>
            {Object.keys(conversations).map((id, index) => (
              <Conversation
                key={index}
                title={id} // Display the subject or JID as the title
                active={id === activeId} // Highlight the active conversation
                onClick={() => setActiveId(id)} // Set the conversation as active when clicked
                lastMessage={conversations[id][conversations[id].length - 1]} // Display the last message in the conversation
              />
            ))}
          </div>

          {activeId && xmppClientProvider && (
            <ChatView
              title={activeId} // Display the subject or JID as the title in the chat view
              client={xmppClientProvider} // Pass the XMPP client provider to the ChatView component
              messages={conversations[activeId]} // Pass the current messages of the active conversation
              onMessagesUpdate={handleMessagesUpdate} // Handle updates to the messages
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default Chats
