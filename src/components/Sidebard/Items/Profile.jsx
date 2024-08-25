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
import { UserRound } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"
import Presence from "./ProfileItems/Presence"
import { useRouter } from "next/navigation"

const Profile = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const router = useRouter()

  const handleRemoveAccount = async () => {
    if (xmppClientProvider) {
      await xmppClientProvider.deleteAccount()
      router.push("/auth")
    }
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button className="bg-transparent hover:bg-transparent px-0">
          <div className="flex flex-col items-center justify-center gap-1">
            <UserRound height={24} width={24} color="#898787" />
            <p className="text-[10px]">Profile</p>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="h-full flex flex-col">
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>Set your presence status</SheetDescription>
          <Presence />
          <Button className="mt-auto w-full" onClick={handleRemoveAccount}>
            Delete account
          </Button>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Profile
