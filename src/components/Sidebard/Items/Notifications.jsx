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
import { Label } from "@/components/ui/label"
import { Bell } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"

const NotificationCard = ({
  notification,
  xmppClientProvider,
  onAccept,
  onReject,
}) => {
  // Clase condicional para cambiar el fondo si la notificación es nueva
  const cardClassName = notification.isNew
    ? "bg-blue-100 p-2 rounded-md"
    : "bg-white p-2 rounded-md"

  switch (notification.type) {
    case "subscribe":
      return (
        <div className={`flex items-center gap-2 ${cardClassName}`}>
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

    case "presence":
      return (
        <div className={`flex items-center gap-2 ${cardClassName}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-full">
            <p className="font-bold">{notification.from}</p>
            <p className="text-[10px]">{notification.message}</p>
          </div>
        </div>
      )

    default:
      return null
  }
}

const Notifications = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (xmppClientProvider) {
      const handleNotificationChange = (newNotifications) => {
        setNotifications((prevNotifications) => {
          const newUniqueNotifications = newNotifications.filter(
            (newNotif) =>
              !prevNotifications.some(
                (prevNotif) =>
                  prevNotif.from === newNotif.from &&
                  prevNotif.message === newNotif.message &&
                  prevNotif.type === newNotif.type
              )
          )

          const updatedNotifications = newUniqueNotifications.map(
            (notification) => ({
              ...notification,
              isNew: true, // Marcar la notificación como nueva
            })
          )

          return [...updatedNotifications.reverse(), ...prevNotifications]
        })

        // Aumentar el contador sólo si hay nuevas notificaciones agregadas
        if (newNotifications.length > 0) {
          setUnreadCount((prevCount) => prevCount + newNotifications.length)
        }
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

  const handleOpenNotifications = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isNew: false, // Marcar todas las notificaciones como vistas
      }))
    )
    setUnreadCount(0)
  }

  return (
    <Sheet>
      <SheetTrigger onClick={handleOpenNotifications}>
        <Button className="bg-transparent hover:bg-transparent px-0 relative">
          <div className="flex flex-col items-center justify-center gap-1">
            <Bell height={24} width={24} color="#898787" />
            <p className="text-[10px]">Notifications</p>
          </div>
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-full">
          <div className="overflow-y-auto max-h-[400px]">
            {notifications.map((notification, index) => (
              <NotificationCard
                key={index}
                notification={notification}
                xmppClientProvider={xmppClientProvider}
                onAccept={handleAccept}
                onReject={handleReject}
              />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Notifications
