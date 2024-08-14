import React, { useState, useContext, useEffect } from "react"
import { BookUser } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { XMPPContext } from "@/context/xmppContext"

const Contacts = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    const handleContactsUpdate = async () => {
      if (!xmppClientProvider) return

      try {
        const updatedContacts = await xmppClientProvider.getRoster()
        setContacts(updatedContacts)
      } catch (error) {
        console.error("Error fetching contacts:", error)
      }
    }

    handleContactsUpdate()
  }, [xmppClientProvider])

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="bg-transparent hover:bg-transparent px-0">
          <div className="flex flex-col items-center justify-center gap-1">
            <BookUser height={24} width={24} color="#898787" />
            <p className="text-[10px]">Contacts</p>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Contacts</SheetTitle>
        </SheetHeader>
        <div>
          {contacts.length > 0 ? (
            contacts.map((contact, index) => <p key={index}>{contact.jid}</p>)
          ) : (
            <p>No contacts available</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Contacts
