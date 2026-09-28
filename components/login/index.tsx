"use client"
import { ValidateLogin } from "@/app/_lib/server/validate-login/login";
import type { FormState } from "@/app/_lib/server/validate-ic/formvalidator";
import WorldGlobe from "@/assets/images/world-globe.gif"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import Image from "next/image";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (values: FormValues): Errors => {
  const errors: Errors = {};

  const email = values.email.trim();
  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

const FieldError = ({ id, message }: { id: string, message?: string }) => {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-700">
      {message}
    </p>
  )
}


/** main login component */
const LoginHomeIndex = () => {
  const [values, setValues] = useState<FormValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<Touched>({});
  // A rejected attempt keeps the email but never the password.
  const [state, login, isPending] = useActionState(
    async (previous: FormState, formData: FormData) => {
      const result = await ValidateLogin(previous, formData);
      if (result?.message) {
        setValues((prev) => ({ ...prev, password: "" }));
        setTouched((prev) => ({ ...prev, password: false }));
      }
      return result;
    },
    undefined,
  );

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const errors = validate(values);
  const emailError = (touched.email ? errors.email : undefined) ?? state?.errors?.email?.[0];
  const passwordError = (touched.password ? errors.password : undefined) ?? state?.errors?.password?.[0];

  useEffect(() => {
    if (state?.message) passwordRef.current?.focus();
  }, [state])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const name = e.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setTouched({ email: true, password: true });

    if (errors.email) {
      e.preventDefault();
      emailRef.current?.focus();
    } else if (errors.password) {
      e.preventDefault();
      passwordRef.current?.focus();
    }
  }

  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div aria-hidden={true} className="hidden lg:flex flex-col relative isolate justify-center items-center bg-fixed bg-bg-primary">
        <Image
          src={WorldGlobe}
          alt="world globe"
          loading="eager"
          className="absolute text-[8px] h-full w-full object-right object-cover mix-blend-multiply"
        />
        <div className="flex flex-col gap-5 items-center justify-center z-20 h-full mx-10 max-w-80 text-neutral-white">
          <h1 className="text-3xl text-transparent bg-clip-text bg-[linear-gradient(308.91deg,#FB923C_-14.83%,#F67B58_-0.69%,#F05E7E_17.87%,#EC4899_31.57%,#CE41B5_56.42%,#A136DD_96.49%,#9333EA_106.56%)] font-extrabold">
            Welcome to <br /> Admin InstantConnect
          </h1>
          <p className=" font-medium text-sm">
            Secure and centralized platform for seamless communication and user management
          </p>
        </div>
      </div>
      <main className="relative lg:col-span-2 flex items-center justify-center isolate bg-[#122348] lg:bg-slate-100 px-4 py-10">
        <Image
          src={WorldGlobe}
          alt="world globe"
          loading="eager"
          aria-hidden={true}
          unoptimized
          className="absolute lg:hidden text-[8px] h-full w-full object-cover mix-blend-multiply"
        />
        <section className="2xl:w-[40%] overflow-hidden rounded-lg bg-neutral-white shadow-sm ring-[.25px] ring-neutral-white z-20">
          <div aria-hidden={true} className="h-1.5 bg-bg-primary" />

          <div className="px-6 pb-7 pt-6 sm:px-8">
            <h1 className="text-xl font-semibold text-neutral-light-600">
              Admin Sign In
            </h1>
            <p className="mt-1 text-sm text-neutral-light-400">
              Enter your admin credentials to continue.
            </p>

            <form action={login} id="form_login" noValidate className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {state?.message && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  {state.message}
                </div>
              )}

              <div>
                <Label htmlFor={`${uid}-email`} className="mb-1.5 text-neutral-light-600">
                  Email
                </Label>
                <Input
                  ref={emailRef}
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isPending}
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? `${uid}-email-error` : undefined}
                />
                <FieldError id={`${uid}-email-error`} message={emailError} />
              </div>

              <div>
                <Label htmlFor={`${uid}-password`} className="mb-1.5 text-neutral-light-600">
                  Password
                </Label>
                <PasswordInput
                  ref={passwordRef}
                  id={`${uid}-password`}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isPending}
                  required
                  autoComplete="current-password"
                  aria-invalid={passwordError ? true : undefined}
                  aria-describedby={passwordError ? `${uid}-password-error` : undefined}
                />
                <FieldError id={`${uid}-password-error`} message={passwordError} />
              </div>

              <Button type="submit" size="lg" loading={isPending} className="w-full font-semibold">
                {isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LoginHomeIndex
