"use client"

import React from "react"
import { LogOut, MessageSquare, UserRoundSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

import SideBarItem from "./SideBarItem"
import { signOut } from "@/api/profile"

const Sidebar = () => {
  return (
    <div className="h-full w-42 p-2 flex flex-col gap-6 text-[#898787]">
      <SideBarItem title="Contacts" path="/dashboard/contacts">
        <UserRoundSearch color="#898787" />
      </SideBarItem>

      <SideBarItem title="All chats" path="/dashboard/chats">
        <MessageSquare color="#898787" height={24} width={24} />
      </SideBarItem>

      {/* <Button className="bg-transparent hover:bg-[#464646] h-auto mt-auto"
      onClick={() => signOut()}
      >
        <div className="flex flex-col gap-1 justify-center items-center p-4 bg-transparent">
          <LogOut height={24} width={24} color="#898787" />
          <p className="text-[10px] text-[#898787]">Logout</p>
        </div>
      </Button> */}

      <SideBarItem title="Logout" path="/auth/signin">
        <LogOut color="#898787" className="mt-auto" onClick={() => signOut()}
        />
      </SideBarItem>
    </div>
  )
}

export default Sidebar
