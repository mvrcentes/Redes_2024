"use client"

import React, { useState, useContext, useEffect } from "react"
import { XMPPContext } from "@/context/xmppContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import CustomFormField from "../reusable/CustomFormField"
import { SubmitButton } from "../reusable/SubmitButton"
import { registerFormSchema } from "@/lib/validations"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const Login = ({ registerValues }) => {
  // Accessing XMPP context to set credentials and manage the XMPP client
  const { setCredentials, xmppClientProvider } = useContext(XMPPContext)

  // State to manage loading status during form submission
  const [isLoading, setIsLoading] = useState(false)

  // Toast notification handler
  const { toast } = useToast()

  // Router to navigate to different pages
  const router = useRouter()

  // Form setup with validation schema, defaulting to registered values if provided
  const form = useForm({
    resolver: zodResolver(registerFormSchema), // Using Zod schema for validation
    defaultValues: {
      jid: registerValues ? registerValues.jid : "ram21032", // Default JID, if provided by registration
      password: registerValues ? registerValues.password : "ram21032", // Default password, if provided by registration
      websocket: "ws://alumchat.lol:7070/ws/", // Default websocket URL for XMPP connection
    },
  })

  // Function to handle form submission
  const onSubmit = async (data) => {
    setIsLoading(true) // Set loading state to true during submission

    try {
      // Set credentials in XMPP context for connecting to the server
      setCredentials({
        service: data.websocket, // WebSocket URL
        username: data.jid, // User JID
        password: data.password, // User password
      })
    } catch (error) {
      // Handle any errors during connection attempt
      console.error("Error connecting:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to XMPP server.",
      })
      setIsLoading(false) // Reset loading state if there's an error
    }
  }

  // Effect to redirect the user if the XMPP client is successfully connected
  useEffect(() => {
    if (xmppClientProvider?.xmppClient.status === "online") {
      router.push("/chat") // Redirect to chat page if connection is successful
    }
  }, [xmppClientProvider, router])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Custom form field for JID input */}
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="jid"
          name="jid"
          placeholder="Enter your jid"
        />

        {/* Custom form field for password input */}
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="password"
          name="password"
          placeholder="Enter your password"
        />

        {/* Custom form field for WebSocket URL input */}
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="websocket"
          name="websocket"
          placeholder="Enter your websocket"
        />

        {/* Submit button with loading indicator */}
        <SubmitButton isLoading={isLoading}>Conectarse</SubmitButton>
      </form>
    </Form>
  )
}

export default Login
