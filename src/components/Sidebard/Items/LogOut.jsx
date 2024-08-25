import React, { useContext, useEffect, useState } from "react"
import { XMPPContext } from "@/context/xmppContext"
import { useRouter } from "next/navigation"
import { LogOut as LogOutIcon } from "lucide-react"

const LogOut = () => {
  const { xmppClientProvider } = useContext(XMPPContext) // Access XMPP client provider from context
  const [isMounted, setIsMounted] = useState(false) // State to track component mount status
  const router = useRouter() // Router for navigation

  // Effect to set the mounted state when the component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Function to handle user logout
  const handleLogout = async () => {
    if (xmppClientProvider) {
      await xmppClientProvider.logout() // Call the logout function from the XMPP client
      router.push("/auth") // Redirect to the authentication page after logout
    }
  }

  // Prevent rendering until the component is mounted
  if (!isMounted) return null

  return (
    <div className="flex flex-col items-center justify-center gap-1 mt-auto">
      {/* Logout button with icon */}
      <button onClick={handleLogout} className="mt-auto">
        <LogOutIcon height={24} width={24} color="#898787" />{" "}
        {/* Logout icon */}
      </button>
      <p className="text-[10px]">Logout</p> {/* Label for the logout button */}
    </div>
  )
}

export default LogOut
