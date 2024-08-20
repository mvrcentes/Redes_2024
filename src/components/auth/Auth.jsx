"use client"

import React, { useState, useContext } from "react"
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

const Auth = () => {
  const { setCredentials, xmppClientProvider } = useContext(XMPPContext)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      jid: "ram21032",
      password: "ram21032",
      websocket: "wss://tigase.im:5291/xmpp-websocket",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      // Establecer las credenciales antes de intentar conectar
      setCredentials({
        service: data.websocket,
        username: data.jid,
        password: data.password,
      })

      // Espera un tiempo para asegurar que la inicialización se complete
      setTimeout(async () => {
        if (
          xmppClientProvider &&
          xmppClientProvider.xmppClient.status === "online"
        ) {
          // Notificar al usuario
          toast({
            title: "Connected",
            description: "Successfully connected to XMPP server.",
          })
          router.push("/chat")
        } else {
          toast({
            title: "Connection Error",
            description:
              "Failed to connect to XMPP server. Please check your credentials and try again.",
          })
        }
        setIsLoading(false)
      }, 1000) // Ajusta el tiempo de espera según sea necesario
    } catch (error) {
      console.error("Error connecting:", error)
      toast({
        title: "Connection Error",
        description: "Failed to connect to XMPP server.",
      })
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="jid"
          name="jid"
          placeholder="Enter your jid"
        />
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="password"
          name="password"
          placeholder="Enter your password"
        />
        <CustomFormField
          control={form.control}
          fieldType={"input"}
          label="websocket"
          name="websocket"
          placeholder="Enter your websocket"
        />
        <SubmitButton isLoading={isLoading}>Conectarse</SubmitButton>
      </form>
    </Form>
  )
}

export default Auth
