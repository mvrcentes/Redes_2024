import React, { useContext, useEffect, useState } from "react"
import { XMPPContext } from "@/context/xmppContext"
import { useRouter } from "next/navigation"
import { LogOut as LogOutIcon } from "lucide-react"

const LogOut = () => {
  const { xmppClientProvider } = useContext(XMPPContext)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    if (xmppClientProvider) {
      await xmppClientProvider.logout() // Llama a la función logout del XMPPClient
      router.push("/auth") // Redirige a la página de autenticación después de cerrar sesión
    }
  }

  if (!isMounted) return null // No renderizar hasta que esté montado

  return (
    <div className="flex flex-col items-center justify-center gap-1 mt-auto">
      <button onClick={handleLogout} className="mt-auto">
        <LogOutIcon height={24} width={24} color="#898787" />
      </button>
      <p className="text-[10px]">Logout</p>
    </div>
  )
}
export default LogOut
