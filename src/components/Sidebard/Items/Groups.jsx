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
  const { xmppClientProvider } = useContext(XMPPContext)
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const serviceJid = "conference.alumchat.lol" // Reemplaza con el JID del servicio MUC de tu servidor

  useEffect(() => {
    if (xmppClientProvider) {
      const fetchGroups = async () => {
        setIsLoading(true)
        try {
          const availableGroups = await xmppClientProvider.getAvailableGroups(
            serviceJid
          )
          setGroups(availableGroups)
        } catch (error) {
          console.error("Failed to fetch groups:", error)
          toast({
            title: "Error fetching groups",
            description: "Could not retrieve the list of groups.",
            status: "error",
          })
        } finally {
          setIsLoading(false)
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
          <SheetTitle>Available Groups</SheetTitle>
          <SheetDescription>Join a group chat</SheetDescription>

          {isLoading ? (
            <p>Loading groups...</p>
          ) : (
            <ul>
              {groups.length > 0 ? (
                groups.map((group) => (
                  <li key={group.jid} className="my-2">
                    <p className="font-bold">{group.name || group.jid}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        xmppClientProvider.acceptGroupChatInvite(
                          group.jid,
                          null
                        )
                      }>
                      Join
                    </Button>
                  </li>
                ))
              ) : (
                <p>No groups available.</p>
              )}
            </ul>
          )}

          <Button className="mt-auto w-full" variant="destructive">
            Delete account
          </Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Groups
