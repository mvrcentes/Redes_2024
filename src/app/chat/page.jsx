"use client"

import React, { useState, useContext } from "react"
import { XMPPContext } from "@/context/xmppContext"
import Chats from "@/components/chat/Chats"
const page = () => {
  const { xmppClient, setCredentials } = useContext(XMPPContext)

  return <Chats />
}

export default page
