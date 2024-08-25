"use client"

import React, { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SquarePen } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"

const SendMessage = () => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const [domain, setDomain] = useState("") // State to store the XMPP domain
  const [username, setUsername] = useState("") // State to store the recipient's username
  const [message, setMessage] = useState("") // State to store the message content
  const [isDialogOpen, setIsDialogOpen] = useState(false) // State to control the dialog's open/close status

  // Handle changes to the username input field
  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  // Handle changes to the message input field
  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  // Function to send the message using the XMPP client
  const handleSendMessage = () => {
    if (xmppClientProvider) {
      xmppClientProvider.sendMessage(username, message) // Send the message to the specified username
      setMessage("") // Clear the message input field
      setUsername(`@${domain}`) // Reset the username field with the domain
      setIsDialogOpen(false) // Close the dialog
    }
  }

  // Effect to set the domain when the component mounts
  useEffect(() => {
    if (xmppClientProvider) {
      setDomain(xmppClientProvider.xmppClient.jid.getDomain()) // Get the domain from the XMPP client's JID
      setUsername(`@${domain}`) // Prepend the domain to the username field
    }
  }, [xmppClientProvider, domain])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-transparent hover:bg-transparent ml-auto"
          onClick={() => setIsDialogOpen(true)}>
          {" "}
          {/* Open the dialog when the button is clicked */}
          <SquarePen color="black" width={20} height={20} />{" "}
          {/* Icon for starting a new conversation */}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>{" "}
          {/* Dialog title */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Input for the username */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={handleUsernameChange} // Update state when the input changes
              className="col-span-3"
            />
          </div>
          {/* Input for the message */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Message
            </Label>
            <Input
              id="message"
              value={message}
              onChange={handleMessageChange} // Update state when the input changes
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendMessage}>Send</Button>{" "}
          {/* Send button to trigger message sending */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SendMessage
