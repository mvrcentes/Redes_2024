import React from "react"
import AddContact from "./Items/AddContact"
import Notifications from "./Items/Notifications"
import Profile from "./Items/Profile"
import Contacts from "./Items/Contacts"
import LogOut from "./Items/LogOut"
import Groups from "./Items/Groups"

const Sidebar = () => {
  return (
    <div className="h-full w-42 p-2 py-4 flex flex-col gap-6 text-[#898787]">
      <Profile />
      <Contacts />
      <AddContact />
      <Notifications />
      <Groups />
      <LogOut />
    </div>
  )
}

export default Sidebar
