import { z } from "zod"

export const registerFormSchema = z.object({
  jid: z.string()
  .min(2, {
    message: "Username must be at least 2 characters.",
  })
  ,
  password: z.string(),
  websocket: z.string().min(6, {
    message: "Websocket must be at least 6 characters.",
  }),
})