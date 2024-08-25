"use client"

import { createContext, useEffect, useState } from "react"
import XMPPClient from "@/lib/xmpp"
import { parseCookies, setCookie } from "nookies"
import { useRouter } from "next/navigation"

// Context for XMPP
export const XMPPContext = createContext()

// Provider component to manage XMPP client and state
export const XMPPProvider = ({ children }) => {
  const [xmppClientProvider, setXmppClientProvider] = useState(null) // State to store the XMPP client instance
  const [credentials, setCredentials] = useState({
    service: "",
    username: "",
    password: "",
  }) // State to store the user's credentials
  const [isMounted, setIsMounted] = useState(false) // State to track component mount status
  const [isInitialized, setIsInitialized] = useState(false) // State to track XMPP client initialization status
  const router = useRouter() // Router for navigation

  // Effect to set the mounted state when the component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Effect to load saved credentials from cookies
  useEffect(() => {
    if (isMounted) {
      const cookies = parseCookies()
      const savedService = cookies.service
      const savedUsername = cookies.jid
      const savedPassword = cookies.password

      if (savedService && savedUsername && savedPassword) {
        setCredentials({
          service: savedService,
          username: savedUsername,
          password: savedPassword,
        }) // Load saved credentials into state
      }
    }
  }, [isMounted])

  // Effect to initialize the XMPP client when credentials are set
  useEffect(() => {
    const initializeClient = async () => {
      if (
        credentials.service &&
        credentials.username &&
        credentials.password &&
        !xmppClientProvider
      ) {
        const xmppClient = new XMPPClient(
          credentials.service,
          credentials.username,
          credentials.password
        )

        try {
          await xmppClient.initialize() // Initialize the XMPP client
          setXmppClientProvider(xmppClient) // Store the initialized client in state
          setIsInitialized(true) // Mark the client as initialized
          console.log("XMPP Client initialized")

          // Save credentials to cookies
          setCookie(null, "service", credentials.service, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          })
          setCookie(null, "jid", credentials.username, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          })
          setCookie(null, "password", credentials.password, {
            maxAge: 30 * 24 * 60 * 60,
            path: "/",
          })
        } catch (error) {
          console.error("Error initializing XMPP Client:", error)
        }
      }
    }

    if (isMounted) {
      initializeClient()
    }

    // Cleanup function to close the XMPP client when the component unmounts
    return () => {
      if (xmppClientProvider) {
        xmppClientProvider.close()
        setXmppClientProvider(null)
      }
    }
  }, [credentials, isMounted])

  // Effect to redirect to the chat page when the XMPP client is initialized
  useEffect(() => {
    if (isInitialized && xmppClientProvider) {
      router.push("/chat")
    }
  }, [isInitialized, xmppClientProvider, router])

  if (!isMounted) {
    // Prevent rendering until the component is fully mounted
    return null
  }

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

// Disable TLS certificate verification for Node.js
process.env.node_tls_reject_unauthorized = "0"
