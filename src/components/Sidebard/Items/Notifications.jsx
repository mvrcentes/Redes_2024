import React, { useState, useContext, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { XMPPContext } from "@/context/xmppContext"

// Component to render individual notification cards
const NotificationCard = ({ notification, onAccept, onReject }) => {
  // Determine the background color based on whether the notification is new
  const cardClassName = notification.isNew
    ? "bg-blue-100 p-2 rounded-md"
    : "bg-white p-2 rounded-md"

  // Render different UI based on the notification type
  switch (notification.type) {
    case "subscribe":
      return (
        <div className={`flex items-center gap-2 ${cardClassName}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-full">
            <p className="font-bold">{notification.from}</p>
            <div className="flex flex-row items-center">
              <p className="text-[10px]">wants to add you as a contact.</p>
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

    case "groupchat-invite":
      return (
        <div className={`flex items-center gap-2 ${cardClassName}`}>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-full">
            <p className="font-bold">{notification.inviter}</p>
            <div className="flex flex-row items-center">
              <p className="text-[10px]">
                invited you to join the group "{notification.subject}"
              </p>
              <div className="ml-auto flex gap-1">
                <Button
                  className="text-white text-[10px] px-2 py-0 p-0 rounded bg-blue-500 w-14 h-6"
                  onClick={() =>
                    onAccept(notification.from, notification.inviter)
                  }>
                  Accept
                </Button>
                <Button
                  className="text-white text-[10px] px-2 py-1 rounded w-14 h-6"
                  onClick={() =>
                    onReject(notification.from, notification.inviter)
                  }>
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}

const Notifications = () => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const [notifications, setNotifications] = useState([]) // State to store notifications
  const [unreadCount, setUnreadCount] = useState(0) // State to store the count of unread notifications

  // Effect to handle receiving and updating notifications
  useEffect(() => {
    if (xmppClientProvider) {
      const handleNotificationChange = (newNotifications) => {
        setNotifications((prevNotifications) => {
          // Filter out duplicate notifications
          const newUniqueNotifications = newNotifications.filter(
            (newNotif) =>
              !prevNotifications.some(
                (prevNotif) =>
                  prevNotif.from === newNotif.from &&
                  prevNotif.message === newNotif.message &&
                  prevNotif.type === newNotif.type
              )
          )

          // Mark new notifications as "new"
          const updatedNotifications = newUniqueNotifications.map(
            (notification) => ({
              ...notification,
              isNew: true, // Mark notification as new
            })
          )

          return [...updatedNotifications.reverse(), ...prevNotifications] // Combine new and existing notifications
        })

        if (newNotifications.length > 0) {
          setUnreadCount((prevCount) => prevCount + newNotifications.length) // Update unread count
        }
      }

      xmppClientProvider.receiveContactRequest() // Start receiving contact requests
      xmppClientProvider.onNotificationsChange(handleNotificationChange) // Listen for notification changes

      // Cleanup the listener when the component unmounts
      return () => {
        xmppClientProvider.onNotificationsChange(() => {})
      }
    }
  }, [xmppClientProvider])

  // Handle accepting a notification
  const handleAccept = (jid, inviterJid = null) => {
    if (xmppClientProvider) {
      const notification = notifications.find(
        (n) =>
          n.from === jid && (n.inviter === inviterJid || inviterJid === null)
      )

      if (notification) {
        if (notification.type === "subscribe") {
          xmppClientProvider.acceptContactRequest(jid) // Accept contact request
        } else if (notification.type === "groupchat-invite") {
          xmppClientProvider.acceptGroupChatInvite(jid, inviterJid) // Accept group chat invite
        }

        // Remove the accepted notification from the list
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n !== notification)
        )
      }
    }
  }

  // Handle rejecting a notification
  const handleReject = (jid, inviterJid = null) => {
    if (xmppClientProvider) {
      const notification = notifications.find(
        (n) =>
          n.from === jid && (n.inviter === inviterJid || inviterJid === null)
      )

      if (notification) {
        if (notification.type === "subscribe") {
          xmppClientProvider.rejectContactRequest(jid) // Reject contact request
        } else if (notification.type === "groupchat-invite") {
          xmppClientProvider.rejectGroupChatInvite(jid, inviterJid) // Reject group chat invite
        }

        // Remove the rejected notification from the list
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n !== notification)
        )
      }
    }
  }

  // Handle opening the notifications panel
  const handleOpenNotifications = () => {
    // Mark all notifications as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({
        ...notification,
        isNew: false,
      }))
    )
    setUnreadCount(0) // Reset unread count
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
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"></span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto h-full">
          <div className="overflow-y-auto max-h-full">
            {notifications.map((notification, index) => (
              <NotificationCard
                key={index}
                notification={notification}
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
