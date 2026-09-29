import api from "@/lib/axios"
import type { LoginValues } from "@/schemas/validation-schema"
import type { AdminSession } from "@/types/auth"

export const signIn = async (credentials: LoginValues): Promise<AdminSession> => {
  const { data } = await api.post<AdminSession>("/admin/auth/sign-in", credentials)
  return data
}

export const signOut = async (): Promise<void> => {
  await api.post("/admin/auth/sign-out")
}
