"use server"

import { NextResponse } from "next/server"
import { client, xml } from "@xmpp/client"
import jwt from "jsonwebtoken"
import { serialize } from "cookie"
import { cookies } from "next/headers"

export default async function POST(req: any) {
  const { jid, password, websocket } = req.json()

  console.log(req.json())

  try {
    const xmpp = client({
      service: websocket,
      username: jid,
      password: password,
    })

    xmpp.on("error", (err) => {
      console.log("estuve en error")
      console.error(err.message)
    })

    xmpp.on("offline", () => {
      console.log("estuve en offline")
    })

    xmpp.on("online", async () => {
      console.log("online")

      await xmpp.send(xml("presence"))

      // const token = jwt.sign(
      //   { jid: jid, password: password, websocket: websocket },
      //   "secret"
      // )

      // const serializedToken = serialize("Mytoken", token, {
      //   httpOnly: true,
      //   secure: process.env.NODE_ENV === "production",
      //   sameSite: "strict",
      //   maxAge: 10000 * 60 * 60 * 24 * 30,
      //   path: "/",
      // })

      // cookies().set("MyToken", serializedToken, {
      //   secure: false,
      //   httpOnly: true,
      //   sameSite: "strict",
      // })
    })

    xmpp.start()
  } catch (error) {
    console.error("Sign-in failed:", error)
    return new NextResponse(JSON.stringify({ message: "Sign-in failed" }), {
      status: 500,
    })
  }
}
