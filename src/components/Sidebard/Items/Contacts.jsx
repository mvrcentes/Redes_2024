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
  // Determine the status color based on `contact.show`
  let statusColor
  switch (contact.show) {
    case "available":
      statusColor = "#28c840" // Green for available
      break
    case "idle":
      statusColor = "#febb30" // Yellow for idle
      break
    case "unavailable":
      statusColor = "#80848e" // Gray for unavailable
      break
    default:
      statusColor = "#80848e" // Default gray if the status is unknown
      break
  }

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="relative">
        <div className="w-10 h-10 bg-gray-400 text-white rounded-full flex items-center justify-center text-lg font-bold">
          {contact.jid?.charAt(0).toUpperCase()}{" "}
          {/* Display the first letter of the JID */}
        </div>
        <div
          className="w-3 h-3 rounded-full absolute bottom-0 right-0"
          style={{ backgroundColor: statusColor }}></div>{" "}
        {/* Status indicator */}
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-md font-bold">{contact.jid}</p>{" "}
        {/* Display the JID */}
        {contact.status && <p className="text-sm">{contact.status}</p>}{" "}
        {/* Display the contact status if available */}
      </div>
      <hr />
    </div>
  )
}

const Contacts = () => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const [contacts, setContacts] = useState([]) // State to store the list of contacts

  // Effect to fetch and update the contacts list when the component mounts
  useEffect(() => {
    const handleContactsUpdate = async () => {
      if (!xmppClientProvider) return

      try {
        const updatedContacts = await xmppClientProvider.getRoster() // Fetch the contact list (roster)
        console.log("Updated contacts from roster:", updatedContacts)
        setContacts(updatedContacts) // Update the contacts state

        // Listen for changes in contact status
        xmppClientProvider.setContactsUpdateListener((updatedContacts) => {
          setContacts([...updatedContacts]) // Ensure a new array is created to trigger a re-render
        })
      } catch (error) {
        console.error("Error fetching contacts:", error)
      }
    }

    handleContactsUpdate()

    return () => {
      console.log("Cleaning up contacts listener")
      xmppClientProvider?.setContactsUpdateListener(() => {}) // Cleanup the listener on component unmount
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
        {" "}
        {/* Slide-in sheet from the left side */}
        <SheetHeader>
          <SheetTitle>Contacts</SheetTitle>
        </SheetHeader>
        <div className="mt-2 flex flex-col gap-1">
          {/* Render each contact using the ContactCard component */}
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
