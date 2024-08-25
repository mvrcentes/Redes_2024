// middleware.js
import { NextResponse } from "next/server"

// Middleware function to handle authentication
export function middleware(request) {
  // Retrieve cookies containing authentication details
  const jid = request.cookies.get("jid")
  const password = request.cookies.get("password")
  const service = request.cookies.get("service")

  // If any of the required cookies are missing, redirect to the authentication page
  if (!jid || !password || !service) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  // If all cookies are present, allow the request to proceed
  return NextResponse.next()
}

// Configuration for the middleware
export const config = {
  matcher: ["/", "/chat"], // Apply this middleware to the root ("/") and "/chat" routes
}
