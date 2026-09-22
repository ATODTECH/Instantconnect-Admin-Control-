"use client"
import { ValidateLogin } from "@/app/_lib/server/validate-login/login";
import WorldGlobe from "@/assets/images/world-globe.gif"
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
} from "react";

const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "admin", label: "As an admin" },
  { value: "master admin", label: "As a master admin" },
]

const USERNAME_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const ROLE_STYLES = {
  none: {
    strip: "bg-bg-primary",
    button:
      "bg-bg-primary hover:bg-slate-700 focus-visible:ring-bg-primary",
  },
  admin: {
    strip: "bg-teal-700",
    button: "bg-teal-700 hover:bg-teal-800 focus-visible:ring-teal-700",
  },
  'master admin': {
    strip: "bg-violet-800",
    button:
      "bg-violet-800 hover:bg-violet-900 focus-visible:ring-violet-800",
  },
} as const;

const validate = (values: FormValues): Errors => {
  const errors: Errors = {};

  if (!values.role) {
    errors.role = "Select a role to continue.";
  } else if (!ROLE_OPTIONS.some((option) => option.value === values.role)) {
    errors.role = "Select one of the listed roles.";
  }

  const username = values.username.trim();
  if (!username) {
    errors.username = "Enter your username.";
  } else if (username.length < 3 || username.length > 32) {
    errors.username = "Username must be a valid email";
  } else if (!USERNAME_PATTERN.test(username)) {
    errors.username =
      "Use only letters, numbers, dots, dashes or underscores.";
  }

  if (!values.password) {
    errors.password = "Enter your password.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  return errors;
}

const baseField =
  "block w-full rounded-md border bg-neutral-white px-3 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-offset-1 " +
  "motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const fieldClass = (invalid: boolean) =>
  `${baseField} ${
    invalid
      ? "border-red-600 focus:ring-red-600"
      : "border-slate-300 focus:border-slate-500 focus:ring-slate-700"
  }`;


/** main login component */
const LoginHomeIndex = () => {
  const [values, setValues] = useState<FormValues>({
    role: "",
    username: "",
    password: "",
  });
  const [touched, setTouched] = useState<Touched>({});
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const [state, login, isPending] = useActionState(ValidateLogin, undefined);

  const roleRef = useRef<HTMLSelectElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const errors = validate(values);
  const shownError = (field: FieldName) =>
    touched[field] ? errors[field] : undefined;

  const style = ROLE_STYLES[values.role || "none"];

  const roleError = shownError("role");
  const usernameError = shownError("username");
  const passwordError = shownError("password");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }) as FormValues);
    if (formError) setFormError(null);
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name as FieldName;
    setTouched((prev) => ({ ...prev, [name]: true }));
  }
  

  const handleSubmit = () => {
    setFormError(null);
    setTouched({ role: true, username: false, password: false });

    const refs = {
      role: roleRef,
      username: usernameRef,
      password: passwordRef,
    };
    const firstInvalid = (["role", "username", "password"] as const).find(
      (field) => errors[field],
    )
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      return;
    }

    setValues({
      role: "admin" as AdminRole,
      username: "",
      password: "",
    })

    if (!login) return;
  }

  
  // to be changed to re-route and not localStorage
  useEffect(() => {
    localStorage.clear()
  }, [])
  if (state?.message === "admin") {
    localStorage.setItem('roleTest', 'admin')
    location.replace('/')
  } else if (state?.message === "master admin") {
    localStorage.setItem('roleTest', 'master admin')    
    location.replace('/')
  }
  // end

  return (
    <div className="grid lg:grid-cols-3 h-full">
      <div className="flex flex-col relative isolate justify-center items-center bg-fixed bg-bg-primary">
        <Image
          src={WorldGlobe}
          alt="world globe"
          loading="eager"
          className="absolute text-[8px] h-full w-full object-right object-cover mix-blend-multiply"
        />
        <div aria-hidden={true} className="hidden lg:flex flex-col gap-5 items-center justify-center z-20 h-full mx-10 max-w-80 text-neutral-white">
          <h1 className="text-3xl text-transparent bg-clip-text bg-[linear-gradient(308.91deg,#FB923C_-14.83%,#F67B58_-0.69%,#F05E7E_17.87%,#EC4899_31.57%,#CE41B5_56.42%,#A136DD_96.49%,#9333EA_106.56%)] font-extrabold">
            Welcome to <br /> Admin InstantConnect
          </h1>
          <p className=" font-medium text-sm">
            Secure and centralized platform for seamless communication and user management
          </p>
        </div>
      </div>
      <main className="relative col-span-2 flex items-center justify-center isolate bg-bg-primary lg:bg-slate-100 px-4 py-10">
        <Image
          src={WorldGlobe}
          alt="world globe"
          loading="eager"
          aria-hidden={true}
          className="absolute lg:hidden text-[8px] h-full w-full object-cover mix-blend-multiply"
        />
        <section className="2xl:w-[40%] overflow-hidden rounded-lg bg-neutral-white shadow-sm ring-1 ring-slate-900/10 z-20">
          <div
            aria-hidden={true}
            className={`h-1.5 motion-safe:transition-colors ${style.strip}`}
          />

          <div className="px-6 pb-7 pt-6 sm:px-8">
            <h1 className="text-xl font-semibold text-neutral-light-600">
              Admin Sign In
            </h1>
            <p className="mt-1 text-sm text-neutral-light-400">
              Choose your role, then enter your credentials.
            </p>

            <form action={(formData) => {login(formData)}}  id="form_login" noValidate className="mt-6 space-y-5" onSubmit={handleSubmit}>
              {(state?.message==='error') && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  An error occurred with your submission
                </div>
              )}

              {/* Admin role */}
              <div>
                <label
                  htmlFor={`${uid}-role`}
                  className="mb-1.5 block text-sm font-medium text-neutral-light-600"
                >
                  Admin role
                </label>
                <div className="relative">
                  <select
                    ref={roleRef}
                    id={`${uid}-role`}
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isPending}
                    required
                    aria-invalid={roleError ? true : undefined}
                    aria-describedby={roleError ? `${uid}-role-error` : undefined}
                    className={`${fieldClass(Boolean(roleError))} appearance-none pr-10 ${
                      values.role === "" ? "text-slate-400" : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    {ROLE_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                        className="text-neutral-light-600"
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown 
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
                  />
                </div>
                {roleError && (
                  <p
                    id={`${uid}-role-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-red-700"
                  >
                    {roleError}
                  </p>
                )}
                {state?.errors?.role && (
                  <p
                    id={`${uid}-role-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-red-700"
                  >
                    {state.errors.role}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label
                  htmlFor={`${uid}-username`}
                  className="mb-1.5 block text-sm font-medium text-neutral-light-600"
                >
                  Username
                </label>
                <input
                  ref={usernameRef}
                  id={`${uid}-username`}
                  name="username"
                  type="text"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isPending}
                  required
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={usernameError ? true : undefined}
                  aria-describedby={
                    usernameError ? `${uid}-username-error` : undefined
                  }
                  className={fieldClass(Boolean(usernameError))}
                />
                {usernameError && (
                  <p
                    id={`${uid}-username-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-red-700"
                  >
                    {usernameError}
                  </p>
                )}
                {state?.errors?.username && (
                  <p
                    id={`${uid}-role-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-red-700"
                  >
                    {state.errors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor={`${uid}-password`}
                  className="mb-1.5 block text-sm font-medium text-neutral-light-600"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    ref={passwordRef}
                    id={`${uid}-password`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isPending}
                    required
                    autoComplete="current-password"
                    aria-invalid={passwordError ? true : undefined}
                    aria-describedby={
                      passwordError ? `${uid}-password-error` : undefined
                    }
                    className={`${fieldClass(Boolean(passwordError))} pr-16`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((shown) => !shown)}
                    disabled={isPending}
                    aria-pressed={showPassword}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 rounded-r-md px-3 text-sm cursor-pointer font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {passwordError && (
                  <p
                    id={`${uid}-password-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-red-700"
                  >
                    {passwordError}
                  </p>
                )}
                {state?.errors?.password && (
                  <p
                    id={`${uid}-role-error`}
                    role="alert"
                    className="mt-1.5 text-xs text-red-700"
                  >
                    {state.errors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full cursor-pointer rounded-md px-4 py-2.5 text-sm font-semibold text-neutral-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-safe:transition-colors disabled:cursor-not-allowed disabled:opacity-70 ${style.button}`}
              >
                {isPending ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LoginHomeIndex