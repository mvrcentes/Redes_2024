import React, { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { XMPPClient } from "@/lib/xmpp" // Importa tu clase XMPPClient directamente
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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      jid: "",
      password: "",
      websocket: "wss://tigase.im:5291/xmpp-websocket",
    },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)

    try {
      // Crear una nueva instancia de XMPPClient para manejar el registro
      const tempXmppClient = new XMPPClient(
        data.websocket,
        data.jid,
        data.password
      )

      await tempXmppClient.register(data.websocket, data.jid, data.password)

      toast({
        title: "Registration Successful",
        description: "You have been successfully registered. Please log in.",
      })
      router.push("/") // Redirige al login después del registro exitoso
    } catch (error) {
      console.error("Error registering:", error)
      toast({
        title: "Registration Error",
        description: "Failed to register. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
