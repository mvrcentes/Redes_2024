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

const ContactCard = ({ contact }) => {
  // Determinar el color del estado basado en `contact.show`
  let statusColor
  switch (contact.show) {
    case "available":
      statusColor = "#28c840"
      break
    case "idle":
      statusColor = "#febb30"
      break
    case "unavailable":
      statusColor = "#80848e"
      break
    default:
      statusColor = "#80848e" // Por defecto, si no hay un estado conocido
      break
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center text-lg font-bold">
          {contact.jid?.charAt(0).toUpperCase()}
        </div>
        <div
          className="w-3 h-3 rounded-full absolute bottom-0 right-0"
          style={{ backgroundColor: statusColor }}></div>
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-md font-bold">{contact.jid}</p>
        {contact.status && <p className="text-sm">{contact.status}</p>}
      </div>
      <hr />
    </div>
  )
}

const Contacts = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    const handleContactsUpdate = async () => {
      if (!xmppClientProvider) return

      try {
        const updatedContacts = await xmppClientProvider.getRoster()
        console.log("Updated contacts from roster:", updatedContacts)
        setContacts(updatedContacts)

        // Escuchar cambios en el estado de los contactos
        xmppClientProvider.setContactsUpdateListener((updatedContacts) => {
          setContacts([...updatedContacts]) // Asegúrate de crear un nuevo array para forzar el renderizado
        })
      } catch (error) {
        console.error("Error fetching contacts:", error)
      }
    }

    handleContactsUpdate()

    return () => {
      console.log("Cleaning up contacts listener")
      xmppClientProvider?.setContactsUpdateListener(() => {})
    }
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
        <div className="mt-2 flex flex-col gap-1">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <ContactCard key={index} contact={contact} />
            ))
          ) : (
            <p>No contacts available</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Contacts
