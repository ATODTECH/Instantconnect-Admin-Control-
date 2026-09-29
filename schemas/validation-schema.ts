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
