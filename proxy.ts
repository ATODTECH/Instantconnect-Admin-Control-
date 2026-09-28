import { NextRequest, NextResponse } from "next/server"
import { REFRESH_COOKIE } from "@/app/_lib/server/session"

const LOGIN_PATH = "/login"

// Optimistic check only: the cookie's presence decides the redirect, and the
// API still rejects a token that has expired or been revoked.
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(REFRESH_COOKIE)
  const isLogin = request.nextUrl.pathname === LOGIN_PATH

  if (!hasSession && !isLogin) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl))
  }

  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL("/", request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
}
