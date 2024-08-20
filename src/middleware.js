// middleware.js
import { NextResponse } from "next/server"

export function middleware(request) {
  const jid = request.cookies.get("jid")
  const password = request.cookies.get("password")
  const service = request.cookies.get("service")

  if (!jid || !password || !service) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/chat"],
}
