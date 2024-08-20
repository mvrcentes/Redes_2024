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
  const { xmppClientProvider } = useContext(XMPPContext)
  const [contact, setContact] = useState(user)
  const [isInContacts, setIsInContacts] = useState(false)

  const handleRemoveContact = async () => {
    if (xmppClientProvider && user?.jid) {
      try {
        await xmppClientProvider.removeContact(user.jid)
        console.log(`Contact ${user.jid} removed successfully`)
        setIsInContacts(false)
      } catch (error) {
        console.error("Failed to remove contact:", error)
      }
    }
  }

  const handleAddContact = async () => {
    if (xmppClientProvider && user?.jid) {
      try {
        await xmppClientProvider.sendContactRequest(user.jid)
        console.log(`Contact request sent to ${user.jid}`)
        setIsInContacts(true)
      } catch (error) {
        console.error("Failed to send contact request:", error)
      }
    }
  }

  useEffect(() => {
    const handleContactsUpdate = async () => {
      if (!xmppClientProvider) return

      try {
        const updatedContacts = await xmppClientProvider.getRoster()
        const updatedContact = updatedContacts.find((c) => c.jid === user.jid)

        if (updatedContact) {
          setContact(updatedContact)
          setIsInContacts(true)
        } else {
          setIsInContacts(false)
        }

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

    return () => {
      xmppClientProvider?.setContactsUpdateListener(() => {})
    }
  }, [xmppClientProvider, user.jid])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className={`bg-transparent hover:bg-transparent px-0 ${className}`}>
          <Info height={24} width={24} color="#898787" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center">
            <span>{contact.jid.split("@")[0]}</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col items-center py-4">
          <div className="w-24 h-24 bg-[#8BC34A] rounded-full flex items-center justify-center text-4xl font-bold">
            {contact.jid.charAt(0).toUpperCase()}
          </div>
          <p className="text-lg mt-4">{contact.jid}</p>
          <p className="text-sm text-gray-400">Last seen: {contact.show}</p>
          {contact.status && <p className="text-sm">{contact.status}</p>}
        </div>

        <div className="px-4 py-2 space-y-2 mt-6">
          {isInContacts ? (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleRemoveContact}>
              Remove from contacts
            </Button>
          ) : (
            <Button
              variant="primary" // Cambia el color para agregar contacto
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
