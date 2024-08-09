"use client"

import React, { useState, useContext, useEffect } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRoundSearch } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"

const NotificationCard = ({
  notification,
  xmppClientProvider,
  onAccept,
  onReject,
}) => {
  switch (notification.type) {
    case "subscribe":
      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-full">
            <p className="font-bold">{notification.from}</p>
            <div className="flex flex-row items-center">
              <p className="text-[10px]">wants to add you as a contact. </p>
              <div className="ml-auto flex gap-1">
                <Button
                  className="text-white text-[10px] px-2 py-0 p-0 rounded bg-blue-500 w-14 h-6"
                  onClick={() => onAccept(notification.from)}>
                  Accept
                </Button>
                <Button
                  className="text-white text-[10px] px-2 py-1 rounded w-14 h-6"
                  onClick={() => onReject(notification.from)}>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )

      break

    default:
      break
  }
}

const Notifications = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (xmppClientProvider) {
      const handleNotificationChange = (newNotifications) => {
        setNotifications([...newNotifications])
      }

      xmppClientProvider.receiveContactRequest()
      xmppClientProvider.onNotificationsChange(handleNotificationChange)

      // Cleanup function
      return () => {
        xmppClientProvider.onNotificationsChange(() => {})
      }
    }
  }, [xmppClientProvider])

  const handleAccept = (jid) => {
    if (xmppClientProvider) {
      xmppClientProvider.acceptContactRequest(jid)
      
      setNotifications(xmppClientProvider.notifications)
    }
  }

  const handleReject = (jid) => {
    if (xmppClientProvider) {
      xmppClientProvider.rejectContactRequest(jid)
      
      setNotifications(xmppClientProvider.notifications)
    }
  }

  return (
    <Sheet>
      <SheetTrigger>
        <Button className="bg-transparent hover:bg-transparent px-0">
          <div className="flex flex-col items-center justify-center gap-1">
            <UserRoundSearch height={24} width={24} color="#898787" />
            <p className="text-[10px]">Notifications</p>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              notification={notification}
              xmppClientProvider={xmppClientProvider}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

export default Notifications
