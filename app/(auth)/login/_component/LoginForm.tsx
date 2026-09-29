"use client";
import { useFormik } from "formik";
import { Lock, Mail } from "lucide-react";
import { FormButton, FormInput } from "@/components/form";
import { useSignIn } from "@/hooks/use-auth";
import {
	loginValidationSchema,
	type LoginValues,
} from "@/schemas/validation-schema";

const LoginForm = () => {
	const { mutate: signIn, isPending, isSuccess } = useSignIn();
	// Stays busy after success too, until the dashboard replaces this page.
	const isLoading = isPending || isSuccess;

	const formik = useFormik<LoginValues>({
		initialValues: {
			email: "",
			password: "",
		},
		validationSchema: loginValidationSchema,
		onSubmit: (values, { setFieldValue, setFieldTouched }) => {
			signIn(loginValidationSchema.cast(values), {
				// A rejected attempt keeps the email but never the password.
				onError: () => {
					void setFieldValue("password", "", false);
					void setFieldTouched("password", false, false);
				},
			});
		},
	});

	const { getFieldProps, errors, touched, handleSubmit } = formik;

	return (
		<form onSubmit={handleSubmit} noValidate className="w-full">
			<h1 className="text-4xl font-semibold text-ink-title">Sign in</h1>
			<p className="mt-2 text-sm text-ink-meta">
				Welcome back. Enter your admin credentials to continue.
			</p>

			<div className="mt-10 space-y-6">
				<FormInput
					id="email"
					type="email"
					label="Email address"
					placeholder="admin@instantconnect.com"
					autoComplete="username"
					disabled={isLoading}
					iconLeft={<Mail className="h-4 w-4" />}
					inputStyle="h-12 rounded-lg"
					{...getFieldProps("email")}
					touched={touched.email}
					error={errors.email}
				/>

				<FormInput
					id="password"
					type="password"
					label="Password"
					placeholder="Enter your password"
					autoComplete="current-password"
					disabled={isLoading}
					iconLeft={<Lock className="h-4 w-4" />}
					inputStyle="h-12 rounded-lg"
					{...getFieldProps("password")}
					touched={touched.password}
					error={errors.password}
				/>

				<FormButton
					btnStyles="mt-2 h-12 w-full rounded-lg text-sm font-semibold"
					btnType="submit"
					btnText={isLoading ? "Signing in..." : "Sign in"}
					isLoading={isLoading}
				/>
			</div>
		</form>
	);
};

export default LoginForm;
