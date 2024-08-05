"use client"
import React from "react"

import { profileHandler } from "@/api/profile"
import Template from "../components/Template"

const page = () => {
  const getProfile = async () => {
    await profileHandler()
  }
  return (
    <Template>
      <div className="bg-slate-400 w-full rounded-[40px] p-6">
        <h1>Dashboard</h1>

        <button onClick={() => getProfile()}>Get Profile</button>
      </div>
    </Template>
  )
}

export default page
