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
import { UserRoundSearch } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"

const AddContact = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [domain, setDomain] = useState("")

  const sendRequest = async () => {
    console.log("Sending request from addContact")

    if (xmppClientProvider.xmppClient.status === "online") {
      xmppClientProvider.sendContactRequest("ram21032@tigase.im")
    }
  }

  useEffect(() => {
    if (xmppClientProvider) {
      setDomain(xmppClientProvider.xmppClient.jid.getDomain())
    }
  }, [xmppClientProvider])

  return (
    <div className="">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="bg-transparent hover:bg-transparent px-0">
            <div className="flex flex-col items-center justify-center gap-1">
              <UserRoundSearch height={24} width={24} color="#898787" />
              <p className="text-[10px]">Add contact</p>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>Send contact request</SheetTitle>
            <SheetDescription>
              Write the username of the person you want to add
            </SheetDescription>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={`@${domain}`} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button onClick={() => sendRequest()}>Save changes</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default AddContact
