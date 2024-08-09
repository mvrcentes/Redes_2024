// middleware.js
import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("token") 

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url)) // Redirige si no hay token
  }

  return NextResponse.next() // Permite el acceso si hay token
}

export const config = {
  matcher: ["/chat", "/"], // Aplica el middleware a las rutas protegidas
}
