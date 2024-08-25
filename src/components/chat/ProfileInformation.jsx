"use client"

import React, { useState, useContext, useEffect } from "react"
import { Info } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { XMPPContext } from "@/context/xmppContext"

const ProfileInformation = ({ className, user }) => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const [contact, setContact] = useState(user) // State to store contact information
  const [isInContacts, setIsInContacts] = useState(false) // State to track if the user is in the contact list

  // Function to remove a contact
  const handleRemoveContact = async () => {
    if (xmppClientProvider && user?.jid) {
      try {
        await xmppClientProvider.removeContact(user.jid) // Remove the contact using XMPP client
        console.log(`Contact ${user.jid} removed successfully`)
        setIsInContacts(false) // Update state to reflect that the contact is removed
      } catch (error) {
        console.error("Failed to remove contact:", error)
      }
    }
  }

  // Function to add a contact
  const handleAddContact = async () => {
    if (xmppClientProvider && user?.jid) {
      try {
        await xmppClientProvider.sendContactRequest(user.jid) // Send a contact request using XMPP client
        console.log(`Contact request sent to ${user.jid}`)
        setIsInContacts(true) // Update state to reflect that the contact is added
      } catch (error) {
        console.error("Failed to send contact request:", error)
      }
    }
  }

  // Effect to fetch and update contact information
  useEffect(() => {
    const handleContactsUpdate = async () => {
      if (!xmppClientProvider) return

      try {
        const updatedContacts = await xmppClientProvider.getRoster() // Fetch the roster (contact list)
        const updatedContact = updatedContacts.find((c) => c.jid === user.jid) // Find the current user in the contact list

        if (updatedContact) {
          setContact(updatedContact) // Update contact information if found
          setIsInContacts(true) // Mark the contact as part of the contact list
        } else {
          setIsInContacts(false) // Mark the contact as not in the contact list
        }

        // Set a listener to update the contact list whenever it changes
        xmppClientProvider.setContactsUpdateListener((updatedContacts) => {
          const updatedContact = updatedContacts.find((c) => c.jid === user.jid)
          if (updatedContact) {
            setContact(updatedContact)
            setIsInContacts(true)
          } else {
            setIsInContacts(false)
          }
        })
      } catch (error) {
        console.error("Error fetching contacts:", error)
      }
    }

    handleContactsUpdate()

    // Clean up the listener when the component unmounts
    return () => {
      xmppClientProvider?.setContactsUpdateListener(() => {})
    }
  }, [xmppClientProvider, user.jid])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className={`bg-transparent hover:bg-transparent px-0 ${className}`}>
          <Info height={24} width={24} color="#898787" />{" "}
          {/* Info icon trigger */}
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        {" "}
        {/* Slide-in content from the right side */}
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>{contact.jid.split("@")[0]}</span>{" "}
            {/* Display the contact's name */}
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col items-center py-4">
          {/* Display the contact's initial in a colored circle */}
          <div className="w-24 h-24 bg-[#8BC34A] rounded-full flex items-center justify-center text-4xl font-bold">
            {contact.jid.charAt(0).toUpperCase()}
          </div>
          {/* Display the full JID and status information */}
          <p className="text-lg mt-4">{contact.jid}</p>
          <p className="text-sm text-gray-400">Last seen: {contact.show}</p>
          {contact.status && <p className="text-sm">{contact.status}</p>}
        </div>
        <div className="px-4 py-2 space-y-2 mt-6">
          {/* Conditionally render a button to add or remove the contact */}
          {isInContacts ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleRemoveContact}>
              Remove from contacts
            </Button>
          ) : (
            <Button
              variant="primary" // Change color to indicate adding a contact
              className="w-full"
              onClick={handleAddContact}>
              Add to contacts
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default ProfileInformation
