import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { xml, client } from "@xmpp/client"
import { Form } from "@/components/ui/form"
import CustomFormField from "../reusable/CustomFormField"
import { SubmitButton } from "../reusable/SubmitButton"
import { useToast } from "@/components/ui/use-toast"

// Define the form validation schema using Zod
const registerFormSchema = z.object({
  jid: z.string().min(1, "JID is required"), // JID must be provided
  password: z.string().min(6, "Password must be at least 6 characters"), // Password must be at least 6 characters
  websocket: z.string().url("Invalid websocket URL"), // Websocket URL must be valid
})

const Register = ({ handleChangeTab, setRegisterValues }) => {
  // State to store the XMPP client instance
  const [clientInstance, setClientInstance] = useState(null)

  // State to manage loading status during registration
  const [isLoading, setIsLoading] = useState(false)

  // Toast notification handler
  const { toast } = useToast()

  // Initialize the form with default values and validation schema
  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      jid: "cen21032", // Default JID
      password: "cen21032", // Default password
      websocket: "ws://alumchat.lol:7070/ws/", // Default WebSocket URL
    },
  })

  // Function to initialize the XMPP client
  const initialize = async () => {
    const newClient = client({
      service: "ws://alumchat.lol:7070/ws/", // WebSocket service URL
      domain: "alumchat.lol", // XMPP domain
      username: "ram21032", // Default username
      password: "ram21032", // Default password
    })

    // Set up event listeners for the client
    newClient.on("online", () => {
      console.log("Client is online")
      setClientInstance(newClient) // Store the client instance when it goes online
    })

    newClient.on("error", (err) => {
      console.error("Client error:", err) // Log any errors from the client
    })

    newClient.start() // Start the XMPP client
  }

  // Effect to initialize the XMPP client when the component mounts
  useEffect(() => {
    initialize() // Initialize the client on mount

    if (clientInstance) {
      console.log("first") // Example check (this may need refinement)
    }
  }, [clientInstance]) // Dependency array includes `clientInstance` to handle its changes

  // Function to handle the registration process
  const register = async () => {
    setIsLoading(true) // Set loading state to true during registration

    if (!clientInstance) {
      console.log("Client not initialized")
      return
    }

    try {
      // Prepare the registration IQ stanza
      const iq = xml(
        "iq",
        { type: "set", id: "register_1" },
        xml("query", { xmlns: "jabber:iq:register" }, [
          xml("username", {}, form.getValues("jid")), // Add the JID to the IQ stanza
          xml("password", {}, form.getValues("password")), // Add the password to the IQ stanza
        ])
      )

      // Send the IQ stanza to the server
      clientInstance.send(iq)

      // Show a success toast and update parent component state
      toast({
        title: "Registration",
        description: "Registration successful.",
      })
      setRegisterValues(form.getValues()) // Pass form values back to parent component
      handleChangeTab("login") // Switch to the login tab after successful registration
    } catch (error) {
      console.error("Registration error:", error) // Log any errors during registration
      toast({
        title: "Registration Error",
        description: "Failed to register",
      })
    } finally {
      setIsLoading(false) // Reset loading state after registration process
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(register)} className="space-y-6">
        {/* Custom form field for JID input */}
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="JID"
          name="jid"
          placeholder="Enter your JID"
        />

        {/* Custom form field for password input */}
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
        />

        {/* Custom form field for WebSocket URL input */}
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="Websocket"
          name="websocket"
          placeholder="Enter your websocket URL"
        />

        {/* Submit button with loading indicator */}
        <SubmitButton isLoading={isLoading}>Register</SubmitButton>
      </form>
    </Form>
  )
}

export default Register
