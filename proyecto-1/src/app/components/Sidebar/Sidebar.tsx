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

      <Link
        href="/dashboard"
        className="flex flex-col gap-1 justify-center items-center mt-40">
        <UserRoundSearch color="#898787" />
        <p className="text-sm">Contacts</p>
      </Link>

      <Link
        href="/dashboard"
        className="flex flex-col gap-1 justify-center items-center
        
        ">
        <MessageSquare color="#898787" height={24} width={24} />
        <p className="">All chats</p>
      </Link>
    </div>
  )
}

export default Sidebar
