import React from "react"
import { Button } from "@/components/ui/button"
import { UserRound } from "lucide-react"
import classNames from "classnames"

const Conversation = ({ active, onClick, user }) => {
  console.log(user.messages)
  return (
    <Button
      className={classNames({
        "min-h-[78px] min-w-[300px] max-w-[300px] overflow-hidden flex flex-row items-center gap-2 justify-start bg-transparent": true,
        "bg-[#eeeef8]": active,
      })}
      onClick={onClick}>
      <div className="h-auto">
        <UserRound color="#898787" height={48} width={48} />
      </div>
      <div className="min-h-[48px] flex flex-col justify-between items-start overflow-hidden">
        <p className="text-md text-black">{user.jid.split("@")[0]}</p>
        <p className="text-xs text-gray-400 w-full truncate ">
          {user.messages[user.messages.length - 1]?.message}
        </p>
      </div>
    </Button>
  )
}

export default Conversation
