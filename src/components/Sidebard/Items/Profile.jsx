"use client"

import { useContext } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { UserRound } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"
import Presence from "./ProfileItems/Presence"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const Profile = () => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const router = useRouter() // Router for navigation
  const { toast } = useToast() // Toast notification for feedback

  // Function to handle account deletion
  const handleRemoveAccount = async () => {
    if (xmppClientProvider) {
      await xmppClientProvider.deleteAccount() // Delete the user account
      toast({
        title: "Account deleted",
        description: "Your account has been removed",
      }) // Show success message
      router.push("/auth") // Redirect to the authentication page
    }
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="bg-transparent hover:bg-transparent px-0">
          <div className="flex flex-col items-center justify-center gap-1">
            <UserRound height={24} width={24} color="#898787" />
            <p className="text-[10px]">Profile</p>{" "}
            {/* Label for the profile button */}
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        {" "}
        {/* Slide-in sheet from the left side */}
        <SheetHeader className="h-full flex flex-col">
          <SheetTitle>Profile</SheetTitle> {/* Title of the sheet */}
          <SheetDescription>Set your presence status</SheetDescription>{" "}
          {/* Description */}
          <Presence /> {/* Presence status component */}
          <Button className="mt-auto w-full" onClick={handleRemoveAccount}>
            Delete account
          </Button>{" "}
          {/* Button to delete the account */}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Profile
