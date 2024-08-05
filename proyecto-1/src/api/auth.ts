"use server"

import { cookies } from "next/headers"
import { client, xml } from "@xmpp/client"
import jwt from "jsonwebtoken"
import { serialize } from "cookie"

export const handleCookies = (
  jid: string,
  password: string,
  websocket: string
) => {
  cookies().set("jid", jid)
  cookies().set("password", password)
  cookies().set("websocket", websocket)

  const token = jwt.sign(
    { jid: jid, password: password, websocket: websocket },
    "secret"
  )

  const serializedToken = serialize("Mytoken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10000 * 60 * 60 * 24 * 30,
    path: "/",
  })

  cookies().set("Mytoken", token)
}
