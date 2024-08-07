"use server"

import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

export const profileHandler = async () => {
  try {
    const token = cookies().get("MyToken")
    console.log(token)
    // const user = verify(token!, "secret")

    // console.log(user)
  } catch (error) {
    console.log("error")
  }
}

export const getCredentials = async () => {
  try {
    const cookiesData = await cookies()

    const jid = cookiesData.get("jid")?.value
    const password = cookiesData.get("password")?.value
    const websocket = cookiesData.get("websocket")?.value

    return {
      jid,
      password,
      websocket,
    }
  } catch (error) {
    console.log("error")
  }
}


export const signOut = async () => {
  try {
    cookies().delete("jid")
    cookies().delete("password")
    cookies().delete("websocket")
  } catch (error) {
    console.log("error")
  }
}

