"use client"

import { createContext, useEffect, useState } from "react"
import XMPPCLient from "@/lib/xmpp"
import { parseCookies, setCookie } from "nookies"
import { useRouter } from "next/navigation" // Para la redirección

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
  const [isMounted, setIsMounted] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false) // Nuevo estado para manejar la redirección
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

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
        })
      }
    }
  }, [isMounted])

  useEffect(() => {
    const initializeClient = async () => {
      if (
        credentials.service &&
        credentials.username &&
        credentials.password &&
        !xmppClientProvider
      ) {
        const xmppClient = new XMPPCLient(
          credentials.service,
          credentials.username,
          credentials.password
        )

        try {
          await xmppClient.initialize()
          setXmppClientProvider(xmppClient)
          setIsInitialized(true) // Marcar como inicializado para redirigir después
          console.log("XMPP Client initialized")

          // Guardar credenciales en las cookies
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

    // Cleanup function solo se ejecuta cuando el componente se desmonta
    return () => {
      if (xmppClientProvider) {
        xmppClientProvider.close()
        setXmppClientProvider(null)
      }
    }
  }, [credentials, isMounted])

  useEffect(() => {
    // Redirigir a /chat si el cliente XMPP ha sido inicializado correctamente
    if (isInitialized && xmppClientProvider) {
      router.push("/chat")
    }
  }, [isInitialized, xmppClientProvider, router])

  if (!isMounted) {
    // Evitar la renderización hasta que el componente esté completamente montado
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

process.env.node_tls_reject_unauthorized = "0"
