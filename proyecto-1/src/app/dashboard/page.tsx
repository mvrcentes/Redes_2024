"use client"
import React from "react"

import { profileHandler } from "@/api/profile"

const page = () => {
  const getProfile = async () => {
    await profileHandler()
  }
  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={() => getProfile()}>Get Profile</button>
    </div>
  )
}

export default page