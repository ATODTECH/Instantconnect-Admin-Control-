import axios, { type InternalAxiosRequestConfig } from "axios"
import { ROUTES } from "@/lib/routes"

const api = axios.create({
  // Same origin: next.config.ts rewrites /api/v1 to the API.
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
  // The session is a pair of httpOnly cookies the API sets; they only travel with this on.
  withCredentials: true,
})

type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean }

// Shared so that a burst of 401s (a dashboard firing four queries at once) refreshes once.
let refreshInFlight: Promise<unknown> | null = null

const refreshSession = () => {
  refreshInFlight ??= api.post("/admin/auth/refresh").finally(() => {
    refreshInFlight = null
  })
  return refreshInFlight
}

const isAuthRoute = (url?: string) => url?.startsWith("/admin/auth/") ?? false

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error)

    const request = error.config as RetriableRequest | undefined

    // The access cookie lives 15 minutes; renew it once and replay the request.
    if (error.response?.status === 401 && request && !request._retried && !isAuthRoute(request.url)) {
      request._retried = true
      try {
        await refreshSession()
        return api(request)
      } catch {
        window.location.assign(ROUTES.login)
        return Promise.reject(new Error("Your session has ended. Sign in again."))
      }
    }

    if (!error.response) {
      return Promise.reject(new Error("We couldn't reach the server. Check your connection and try again."))
    }

    if (error.response.status === 429) {
      return Promise.reject(new Error("Too many attempts. Wait a minute and try again."))
    }

    const message: string = error.response.data?.message ?? "Something went wrong. Try again."
    return Promise.reject(new Error(message))
  },
)

export default api
