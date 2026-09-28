import { cookies } from "next/headers"

export const ACCESS_COOKIE = "ic_admin_access"
export const REFRESH_COOKIE = "ic_admin_refresh"

export interface AdminSession {
  accessToken: string
  refreshToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresAt: string
}

const baseCookie = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
} as const

export async function createSession(session: AdminSession) {
  const cookieStore = await cookies()

  cookieStore.set(ACCESS_COOKIE, session.accessToken, {
    ...baseCookie,
    maxAge: session.accessTokenExpiresIn,
  })
  cookieStore.set(REFRESH_COOKIE, session.refreshToken, {
    ...baseCookie,
    expires: new Date(session.refreshTokenExpiresAt),
  })
}

export async function readRefreshToken() {
  return (await cookies()).get(REFRESH_COOKIE)?.value
}

export async function deleteSession() {
  const cookieStore = await cookies()

  cookieStore.delete(ACCESS_COOKIE)
  cookieStore.delete(REFRESH_COOKIE)
}

export function apiUrl(path: string) {
  const base = process.env.API_URL

  if (!base) throw new Error("API_URL is not set. Add it to .env.local.")

  return `${base.replace(/\/$/, "")}/api/v1${path}`
}
