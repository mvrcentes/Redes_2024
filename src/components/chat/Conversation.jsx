import React from "react"
import { Button } from "@/components/ui/button"
import { UserRound } from "lucide-react"
import classNames from "classnames"

const Conversation = ({ active, onClick, title, lastMessage }) => {
  // Determine the preview text for the last message or show "No messages" if undefined
  const messagePreview = lastMessage ? lastMessage.message : "No messages"

  return (
    <Button
      className={classNames({
        "min-h-[78px] min-w-[300px] max-w-[300px] overflow-hidden flex flex-row items-center gap-2 justify-start bg-transparent": true, // Default button styles
        "bg-[#eeeef8]": active, // Apply a different background if the conversation is active
      })}
      onClick={onClick} // Handle click event to switch to this conversation
    >
      <div className="h-auto">
        {/* Display user avatar icon */}
        <UserRound color="#898787" height={48} width={48} />
      </div>
      <div className="min-h-[48px] flex flex-col justify-between items-start overflow-hidden">
        {/* Display the conversation title (e.g., contact name or group name) */}
        <p className="text-md text-black">{title}</p>
        {/* Display a preview of the last message, truncating if necessary */}
        <p className="text-xs text-gray-400 w-full truncate ">
          {messagePreview}
        </p>
      </div>
    </Button>
  )
}

export default Conversation
