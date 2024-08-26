import React, { useState, useCallback, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, Trash2 } from "lucide-react" // Añadimos Trash2 para poder eliminar la previsualización
import ProfileInformation from "./ProfileInformation"
import ChatMessage from "./ChatMessage"

const ChatView = ({ title, client, messages = [], onMessagesUpdate }) => {
  const [messageData, setMessageData] = useState("") // State to manage the current message being typed
  const [previewFile, setPreviewFile] = useState(null) // State to handle file preview
  const [file, setFile] = useState(null) // State to store the file object
  const fileInputRef = useRef(null) // Ref to handle file input click

  // Function to send messages or files
  const sendMessage = useCallback(async () => {
    const isGroupChat = title.includes("@muc.") // Detects if the JID belongs to a group based on typical MUC (Multi-User Chat) suffix

    if (file) {
      // If there's a file selected, upload and send the file
      try {
        const fileUrl = await client.uploadFileToServer(file) // Upload the file to the server and get the URL
        if (fileUrl) {
          const messageToSend = `File uploaded: ${fileUrl}` // Message with file URL

          await client.sendMessage(
            title.split("/")[0],
            messageToSend,
            isGroupChat
          )

          const newMessage = {
            message: messageToSend,
            from: client.xmppClient.jid.toString(), // The sender's JID
          }

          onMessagesUpdate([...messages, newMessage]) // Update the message list by adding the new message
          setPreviewFile(null) // Clear the preview after successful upload
          setFile(null) // Clear the file after sending
        }
      } catch (error) {
        console.error("Failed to upload file:", error)
      }
    } else if (messageData.trim() !== "") {
      // If there's no file but there's a text message
      await client.sendMessage(
        title.split("/")[0],
        messageData.trim(),
        isGroupChat
      )

      const newMessage = {
        message: messageData.trim(),
        from: client.xmppClient.jid.toString(), // The sender's JID
      }

      onMessagesUpdate([...messages, newMessage]) // Update the message list by adding the new message
      setMessageData("") // Clear the input field
    }
  }, [client, title, messageData, file, messages, onMessagesUpdate])

  // Function to handle Enter key press for sending a message
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter") {
        sendMessage() // Trigger the sendMessage function when Enter is pressed
      }
    },
    [sendMessage]
  )

  // Function to handle file upload and set up preview
  const handleFileUpload = (event) => {
    const selectedFile = event.target.files[0] // Get the selected file
    if (selectedFile) {
      setPreviewFile(URL.createObjectURL(selectedFile)) // Set preview URL
      setFile(selectedFile) // Store the file object for later upload
    }
  }

  // Function to trigger file input click
  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click() // Trigger the file input click
    }
  }

  // Function to remove file preview
  const removePreview = () => {
    setPreviewFile(null)
    setFile(null) // Clear the file
    if (fileInputRef.current) {
      fileInputRef.current.value = "" // Reset the file input
    }
  }

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

      {/* Preview of the file to be uploaded */}
      {previewFile && (
        <div className="relative flex items-center p-2 border border-gray-300 rounded mb-2">
          <img
            src={previewFile}
            alt="Preview"
            className="w-16 h-16 object-cover mr-2"
          />
          <div className="flex-grow">
            <p className="text-sm">Ready to upload</p>
          </div>
          <Trash2
            onClick={removePreview}
            className="cursor-pointer text-red-500"
          />
        </div>
      )}

      {/* Input field for typing new messages */}
      <div className="flex flex-row bg-[#eeeef8] p-2 items-center">
        <Paperclip
          onClick={handleFileUploadClick}
          className="cursor-pointer mr-2"
        />
        <input
          type="file"
          ref={fileInputRef} // Attach the ref to the hidden file input
          className="hidden"
          onChange={handleFileUpload} // Handle the file selection
        />
        <Input
          placeholder="Type a message"
          onChange={(e) => setMessageData(e.target.value)} // Update the messageData state with the input value
          value={messageData} // Bind the input value to the messageData state
          onKeyDown={handleKeyDown} // Handle Enter key press to send the message
          className="bg-transparent border-none focus-visible:border-transparent focus-visible:ring-0 flex-grow"
        />
        <Send
          className={`mr-2 cursor-pointer ${
            !messageData.trim() && !previewFile ? "text-gray-400" : "text-black"
          }`}
          onClick={sendMessage} // Trigger the sendMessage function when the send icon is clicked
          disabled={!messageData.trim() && !previewFile} // Disable send if there's no message or file
        />
      </div>
    </div>
  )
}

export default ChatView
