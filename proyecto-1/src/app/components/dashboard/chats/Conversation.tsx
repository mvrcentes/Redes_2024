import React from "react"
import { Button } from "@/components/ui/button"
import { UserRound } from "lucide-react"
import classNames from "classnames"

interface ConversationProps {
  name: string
  lastMessage: string
  active: boolean
  onClick: () => void
}

const Conversation = ({
  name,
  lastMessage,
  active,
  onClick,
}: ConversationProps) => {
  return (
    <Button
      className={classNames({
        "min-h-[78px] min-w-[300px] flex flex-row items-center gap-2 justify-start bg-transparent":
          true,
        "bg-[#eeeef8]": active,
      })}
      onClick={onClick}>
      <UserRound color="#898787" height={56} width={56} />
      <div className="min-h-[48px] flex flex-col justify-between items-start">
        <p className="text-md text-black">{name.split("@")[0]}</p>
        <p className="text-xs text-gray-400">{lastMessage}</p>
      </div>
    </Button>
  )
}

export default Conversation
