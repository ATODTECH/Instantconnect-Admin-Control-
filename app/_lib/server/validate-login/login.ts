"use server"
import z from "zod"
import { redirect } from "next/navigation"
import { FormState, LoginFormSchema } from "../validate-ic/formvalidator"
import { AdminSession, apiUrl, createSession, deleteSession, readRefreshToken } from "../session"

// POST
export const ValidateLogin = async (state: FormState, formData: FormData): Promise<FormState> => {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    }
  }

  let res: Response
  try {
    res = await fetch(apiUrl('/admin/auth/sign-in'), {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedFields.data),
      cache: 'no-store',
    })
  } catch {
    return { message: "We couldn't reach the server. Check your connection and try again." }
  }

  if (!res.ok) {
    return { message: await signInErrorMessage(res) }
  }

  await createSession(await res.json() as AdminSession)
  redirect('/')
}

export const SignOut = async () => {
  const refreshToken = await readRefreshToken()

  // The cookies go regardless: a failed revoke must not leave the admin signed in on this browser.
  if (refreshToken) {
    await fetch(apiUrl('/auth/sign-out'), {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    }).catch(() => undefined)
  }

  await deleteSession()
  redirect('/login')
}

async function signInErrorMessage(res: Response): Promise<string> {
  if (res.status === 429) return "Too many sign in attempts. Wait a minute and try again."

  const body = await res.json().catch(() => null) as { message?: unknown } | null

  if ((res.status === 401 || res.status === 403) && typeof body?.message === 'string') {
    return body.message
  }

  return "Something went wrong signing you in. Try again."
}
