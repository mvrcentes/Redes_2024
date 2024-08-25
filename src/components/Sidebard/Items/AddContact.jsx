"use client"

import React, { useState, useContext, useEffect } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRoundSearch } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"

const AddContact = () => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const [domain, setDomain] = useState("") // State to store the XMPP domain
  const [username, setUsername] = useState("") // State to store the contact's username

  // Function to send a contact request
  const sendRequest = async () => {
    console.log("Sending request from addContact")

    if (xmppClientProvider.xmppClient.status === "online") {
      xmppClientProvider.sendContactRequest(username) // Send the contact request if online
    }
  }

  // Handle changes to the username input field
  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  // Effect to set the domain and initialize the username when the component mounts
  useEffect(() => {
    if (xmppClientProvider) {
      setDomain(xmppClientProvider.xmppClient.jid.getDomain()) // Get the domain from the XMPP client's JID
      setUsername(`@${domain}`) // Prepend the domain to the username field
    }
  }, [xmppClientProvider, domain])

  return (
    <div>
      {/* Sheet component for adding a new contact */}
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-transparent hover:bg-transparent px-0">
            <div className="flex flex-col items-center justify-center gap-1">
              <UserRoundSearch height={24} width={24} color="#898787" />
              <p className="text-[10px]">Add contact</p>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          {" "}
          {/* Slide-in sheet from the left side */}
          <SheetHeader>
            <SheetTitle>Send contact request</SheetTitle>
            <SheetDescription>
              Write the username of the person you want to add
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            {/* Input field for the username */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username} // Bind the input value to the username state
                onChange={handleUsernameChange} // Update the state on input change
                className="col-span-3"
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={sendRequest}>Save changes</Button>{" "}
              {/* Trigger the sendRequest function */}
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default AddContact
