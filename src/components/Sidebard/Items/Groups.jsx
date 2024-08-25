"use client"

import { useContext, useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"
import { useToast } from "@/components/ui/use-toast"

const Groups = () => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const [groups, setGroups] = useState([]) // State to store the list of available groups
  const [isLoading, setIsLoading] = useState(false) // State to manage loading status
  const { toast } = useToast() // Toast notification for error handling

  const serviceJid = "conference.alumchat.lol" // Replace with the MUC service JID of your XMPP server

  // Effect to fetch the list of available groups when the component mounts
  useEffect(() => {
    if (xmppClientProvider) {
      const fetchGroups = async () => {
        setIsLoading(true) // Set loading state to true while fetching groups
        try {
          const availableGroups = await xmppClientProvider.getAvailableGroups(
            serviceJid
          ) // Fetch the available groups from the XMPP server
          setGroups(availableGroups) // Update the groups state with the fetched data
        } catch (error) {
          console.error("Failed to fetch groups:", error)
          toast({
            title: "Error fetching groups",
            description: "Could not retrieve the list of groups.",
            status: "error",
          }) // Display an error toast if fetching fails
        } finally {
          setIsLoading(false) // Set loading state to false after the operation completes
        }
      }

      fetchGroups()
    }
  }, [xmppClientProvider, toast])

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="bg-transparent hover:bg-transparent px-0">
          <div className="flex flex-col items-center justify-center gap-1">
            <Users height={24} width={24} color="#898787" />
            <p className="text-[10px]">Groups</p>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="h-full flex flex-col">
          <SheetTitle>Available Groups</SheetTitle> {/* Title of the sheet */}
          <SheetDescription>Join a group chat</SheetDescription>{" "}
          {/* Description */}
          {/* Display loading message or list of groups */}
          {isLoading ? (
            <p>Loading groups...</p>
          ) : (
            <ul>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li key={group.jid} className="my-2">
                    <p className="font-bold">{group.name || group.jid}</p>{" "}
                    {/* Group name or JID */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        xmppClientProvider.acceptGroupChatInvite(
                          group.jid,
                          null
                        )
                      }>
                      {" "}
                      {/* Button to join the group */}
                      Join
                    </Button>
                  </li>
                ))
              ) : (
                <p>No groups available.</p>
              )}
            </ul>
          )}
          {/* Button to delete the account (additional functionality) */}
          <Button className="mt-auto w-full" variant="destructive">
            Delete account
          </Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Groups
