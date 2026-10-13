import { NextRequest, NextResponse } from "next/server"
import { ADMIN_REFRESH_COOKIE } from "@/lib/session"
import { PUBLIC_PATHS, ROUTES } from "@/lib/routes"

const LOGIN_PATH = ROUTES.login

// Optimistic check only: the cookie's presence decides the redirect, and the
// API still rejects a token that has expired or been revoked.
export function proxy(request: NextRequest) {
  if (PUBLIC_PATHS.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const hasSession = request.cookies.has(ADMIN_REFRESH_COOKIE)
  const isLogin = request.nextUrl.pathname === LOGIN_PATH

  if (!hasSession && !isLogin) {
    return NextResponse.redirect(new URL(LOGIN_PATH, request.nextUrl))
  }

  if (hasSession && isLogin) {
    return NextResponse.redirect(new URL(ROUTES.overview, request.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
}
