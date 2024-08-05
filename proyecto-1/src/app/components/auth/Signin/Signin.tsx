"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { registerFormSchema } from "@/lib/validations"
import CustomFormField from "../../reusable/CustomFormField"
import { SubmitButton } from "../../reusable/SubmitButton"
import { FormFieldType } from "@/lib/types"
import { useState } from "react"
import axios from "axios"
import { handleCookies } from "@/api/auth"
import { client, xml } from "@xmpp/client"
import { useRouter } from "next/navigation"

export function Signin() {
  
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      jid: "ram21032",
      password: "ram21032",
      websocket: "wss://tigase.im:5291/xmpp-websocket",
    },
  })

  async function onSubmit(data: z.infer<typeof registerFormSchema>) {
    setIsLoading(true)
    try {
      // const token = await signIn(data.jid, data.password, data.websocket)

      const xmpp = await client({
        service: data.websocket,
        // domain: "tigase.im",
        // resource: "example",
        username: data.jid,
        password: data.password,
      })

      await xmpp.on("error", (err) => {
        console.log("estuve en error front")
        console.error(err.message)
        return "error"
      })

      await xmpp.on("offline", () => {
        console.log("estuve en offline front")
        console.log("offline")
      })

      xmpp.on("online", () => {
        console.log("online front")
        handleCookies(data.jid, data.password, data.websocket)

        toast({
          title: "Connected",
          description: "Successfully connected to XMPP server.",
        })

        router.push("/dashboard")
      })
      xmpp.start()

      toast({
        title: "Connected",
        description: "Successfully connected to XMPP server.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to XMPP server.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="jid"
          name="jid"
          placeholder="Enter your jid"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="password"
          name="password"
          placeholder="Enter your password"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="websocket"
          name="websocket"
          placeholder="Enter your websocket"
        />
        <SubmitButton isLoading={isLoading}>Conectarse</SubmitButton>
      </form>
    </Form>
  )
}
