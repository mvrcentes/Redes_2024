"use client"

import React, { useContext, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SquarePen } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"
import { set } from "date-fns"

const SendMessage = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [domain, setDomain] = useState("")
  const [username, setUsername] = useState("")
  const [message, setMessage] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handleMessageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (xmppClientProvider) {
      xmppClientProvider.sendMessage(username, message)
      setMessage("")
      setUsername(`@${domain}`)
      setIsDialogOpen(false)
    }
  }

  useEffect(() => {
    if (xmppClientProvider) {
      setDomain(xmppClientProvider.xmppClient.jid.getDomain())
      setUsername(`@${domain}`)
    }
  }, [xmppClientProvider, domain])

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-transparent hover:bg-transparent ml-auto"
          onClick={() => setIsDialogOpen(true)}>
          <SquarePen color="black" width={20} height={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start a new conversation</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Message
            </Label>
            <Input
              id="message"
              value={message}
              onChange={handleMessageChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendMessage}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SendMessage
