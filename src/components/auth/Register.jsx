import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { xml, client } from "@xmpp/client"
import { Form } from "@/components/ui/form"
import CustomFormField from "../reusable/CustomFormField"
import { SubmitButton } from "../reusable/SubmitButton"
import { useToast } from "@/components/ui/use-toast"

const registerFormSchema = z.object({
  jid: z.string().min(1, "JID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  websocket: z.string().url("Invalid websocket URL"),
})

const Register = () => {
  const [clientInstance, setClientInstance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      jid: "cen21032",
      password: "cen21032",
      websocket: "ws://alumchat.lol:7070/ws/",
    },
  })

  const initialize = async () => {
    const newClient = client({
      service: "ws://alumchat.lol:7070/ws/",
      domain: "alumchat.lol",
      username: "ram21032",
      password: "ram21032",
    })

    newClient.on("online", () => {
      console.log("Client is online")
      setClientInstance(newClient)
    })

    newClient.on("error", (err) => {
      console.error("Client error:", err)
    })

    newClient.start()
  }

  useEffect(() => {
    initialize()

    if (clientInstance) {
      console.log("first")
    }
  }, [])

  const register = async () => {
    setIsLoading(true)
    if (!clientInstance) {
      console.log("sin cliente")
      return
    }

    try {
      console.log(form.getValues("jid"))
      console.log(form.getValues("password"))

      const iq = xml(
        "iq",
        { type: "set", id: "register_1" },
        xml("query", { xmlns: "jabber:iq:register" }, [
          xml("username", {}, form.getValues("jid")),
          xml("password", {}, form.getValues("password")),
        ])
      )

      clientInstance.send(iq)
    } catch (error) {
      console.error("Registration error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(register)} className="space-y-6">
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="JID"
          name="jid"
          placeholder="Enter your JID"
        />
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
        />
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="Websocket"
          name="websocket"
          placeholder="Enter your websocket URL"
        />
        <SubmitButton isLoading={isLoading}>Register</SubmitButton>
      </form>
    </Form>
  )
}

export default Register
