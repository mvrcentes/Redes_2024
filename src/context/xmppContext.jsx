"use client"

import { createContext, useEffect, useState } from "react"
import XMPPCLient from "@/lib/xmpp"
import { client } from "@xmpp/client"

// Context
export const XMPPContext = createContext()

// Provider
export const XMPPProvider = ({ children }) => {
  const [xmppClientProvider, setXmppClientProvider] = useState(null)
  const [credentials, setCredentials] = useState({
    service: "",
    username: "",
    password: "",
  })

  useEffect(() => {
    const initializeClient = async () => {
      if (credentials.service && credentials.username && credentials.password) {
        const xmppClient = new XMPPCLient(
          credentials.service,
          credentials.username,
          credentials.password
        )

        try {
          await xmppClient.initialize()
          setXmppClientProvider(xmppClient)
          console.log("XMPP Client initialized")
        } catch (error) {
          console.error("Error initializing XMPP Client:", error)
        }
      }
    }

    initializeClient()    

    // Cleanup function
    return () => {
      if (xmppClientProvider) {
        xmppClientProvider.close()
      }
    }
  }, [credentials])

  return (
    <XMPPContext.Provider
      value={{
        xmppClientProvider,
        setXmppClientProvider,
        credentials,
        setCredentials,
      }}>
      {children}
    </XMPPContext.Provider>
  )
}

process.env.node_tls_reject_unauthorized = '0'