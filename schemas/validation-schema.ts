import * as yup from "yup"

// Sign in only checks that something was entered. The password policy belongs
// to sign up; an account made under an older policy must still get in.
export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address.")
    .required("Enter your email address."),
  password: yup.string().required("Enter your password."),
})

export type LoginValues = yup.InferType<typeof loginValidationSchema>

// Mirrors the API's support message limits.
export const messageUserValidationSchema = yup.object({
  subject: yup.string().trim().max(120, "Keep the subject under 120 characters.").required("Add a subject."),
  body: yup.string().trim().max(2000, "Keep the message under 2,000 characters.").required("Write a message."),
})

export type MessageUserValues = yup.InferType<typeof messageUserValidationSchema>
