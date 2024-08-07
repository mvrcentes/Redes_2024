import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

export async function middleware(request: NextRequest) {
  const jid = request.cookies.get("jid")
  const token = request.cookies.get("Mytoken")?.value.toString()

  if (jid === undefined) {
    return NextResponse.redirect(new URL("/auth/signin", request.nextUrl))
  }

  try {
    const secretKey = new TextEncoder().encode("secret")
    const { payload } = await jwtVerify(token!.toString(), secretKey)

    return NextResponse.next()
  } catch (error) {
    console.log(error)
    return NextResponse.redirect(new URL("/auth/signin", request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
