import { z } from 'zod'


export const LoginFormSchema = z.object({
  role: z
    .enum(['admin','master admin'], {message:"Role must be either 'admin' or 'master admin'."}),
  username: z
    .string()
    .min(3, {message:"Username must be a valid email. "})
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {message:"Email is not valid."})
    .trim(),
  password: z
    .string()
    .min(8, {message:"Password must be at least 8 characters."})
    .trim(),
})


export type FormState =
  | {
      errors?: {
        role?: string[],
        username?: string[],
        password?: string[],
      }
      message?: string,
    }
  |   undefined;