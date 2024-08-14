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

const Profile = () => {
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
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
          <SheetDescription>Set your presence status</SheetDescription>
          <Presence />
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Profile
