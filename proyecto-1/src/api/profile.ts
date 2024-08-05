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