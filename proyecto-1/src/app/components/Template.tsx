import Sidebar from "./Sidebar/Sidebar"
import React from "react"

interface TemplateProps {
  children: React.ReactNode
}

const Template = ({ children }: TemplateProps) => {
  return (
    <div className="h-dvh w-full flex gap-2 bg-[#202022] p-2">
      <Sidebar />
      {children}
    </div>
  )
}

export default Template
