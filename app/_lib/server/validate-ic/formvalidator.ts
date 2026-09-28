import { z } from 'zod'


export const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {message:"Enter a valid email address."}),
  password: z
    .string()
    .min(1, {message:"Enter your password."}),
})


export type FormState =
  | {
      errors?: {
        email?: string[],
        password?: string[],
      }
      message?: string,
    }
  |   undefined;
