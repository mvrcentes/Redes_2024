"use client"

import React from "react"
import { MessageSquare, UserRoundSearch } from "lucide-react"
import Link from "next/link"

import SideBarItem from "./SideBarItem"

const Sidebar = () => {
  return (
    <div className="h-full w-42 p-2 flex flex-col gap-6 text-[#898787]">
      <SideBarItem title="Contacts" path="/dashboard/contacts">
        <UserRoundSearch color="#898787" />
      </SideBarItem>

      <SideBarItem title="All chats" path="/dashboard/chats">
        <MessageSquare color="#898787" height={24} width={24} />
      </SideBarItem>
    </div>
  )
}

export default Sidebar
