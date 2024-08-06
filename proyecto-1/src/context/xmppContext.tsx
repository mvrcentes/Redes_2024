"use client"

import React, { createContext, useState, ReactNode } from "react"
import { Client, client, xml } from "@xmpp/client"
import { getCookie } from "@/api/auth"

interface XMPPContextType {
  xmppClient: Client | null
  setXmppClient: (client: Client) => void
}

// Context
export const XMPPContext = createContext<XMPPContextType>({
  xmppClient: null,
  setXmppClient: () => {},
})

interface XMPPProviderProps {
  children: ReactNode
}

// Provider
export const XMPPProvider = ({ children }: XMPPProviderProps) => {
  const [xmppClient, setXmppClient] = useState<Client | null>(null)
 
  return (
    <XMPPContext.Provider value={{ xmppClient, setXmppClient }}>
      {children}
    </XMPPContext.Provider>
  )
}
