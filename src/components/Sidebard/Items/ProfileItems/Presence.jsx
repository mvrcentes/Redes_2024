"use client"

import React, { useState, useContext, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { XMPPContext } from "@/context/xmppContext"

const Presence = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [presence, setPresence] = useState("")

  const handlePresenceChange = (e) => {
    setPresence(e.target.value)
  }

  const handleSave = () => {
    xmppClientProvider.setPresence(presence)
  }

  useEffect(() => {
    const handleStanza = (stanza) => {
      if (stanza.is("presence")) {
        const from = stanza.attrs.from
        const status = stanza.getChildText("status")
        console.log(`Presence received from ${from}: ${status}`)
        console.log(xmppClientProvider.xmppClient.jid.getLocal().split("/")[0], "este es el local ")
        if (from.split('@')[0] === xmppClientProvider.xmppClient.jid.getLocal().split("/")[0]) {
          console.log("estoy aqui", status)
          setPresence(status)
        }
      }
    }

    // Subscribirse a los eventos de stanzas
    xmppClientProvider.xmppClient.on("stanza", handleStanza)

    // Limpieza al desmontar el componente
    return () => {
      xmppClientProvider.xmppClient.off("stanza", handleStanza)
    }
  }, [xmppClientProvider, presence])

  console.log(xmppClientProvider.xmppClient.status)

  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor="presence" className="text-right">
        Presence
      </Label>
      <Input
        id="presence"
        value={presence}
        onChange={handlePresenceChange}
        placeholder="What are you thinking?"
        className="col-span-3"
      />
      <Button onClick={handleSave} >Save</Button>
    </div>
  )
}

export default Presence
