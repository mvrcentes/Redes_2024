import React from "react"
import Link from "next/link"
import { UserRound } from "lucide-react"

interface ContactCardProps {
  name: string
  jid: string
}

const ContactCard = ({ name, jid }: ContactCardProps) => {
  return (
    <Link href={"/"} className="flex flex-row gap-4 p-4 items-center bg-slate-600 rounded-xl max-w-[200px]">
      <UserRound color="#898787" height={24} width={24}/>
      <div className="flex flex-col gap-1">
        <p>{name}</p>
        <p className="text-sm">{jid}</p>
      </div>
    </Link>
  )
}

export default ContactCard
