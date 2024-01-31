import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { Form, useActionData } from '@remix-run/react'
import { useRedirectTo } from '../../join+/hooks/redirect'
import { schema, type Action } from '../action'
import { PasswordForgottenLink } from './password-forgotten-link'

export function LoginForm() {
	const redirectToFromQuery = useRedirectTo()
	const lastSubmission = useActionData<Action>()

	const [form, { email, password, redirectTo, remember }] = useForm({
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		id: 'login-form',
		shouldRevalidate: 'onBlur',
		defaultValue: {
			redirectTo: redirectToFromQuery ?? '/',
		},
	})

	return (
		<Form method="post" className="space-y-6" {...form.props}>
			{!!form.error && (
				<div className="alert alert-error">
					<span>{form.error}</span>
				</div>
			)}
			<div className="form-control">
				<label htmlFor={email.id} className="label">
					<span className="label-text">Email address</span>
				</label>
				<div className="mt-1">
					<input
						{...conform.input(email, {
							type: 'email',
							ariaAttributes: true,
						})}
						required
						autoFocus={true}
						autoComplete="email"
						className={`input-bordered input w-full ${
							email.error ? 'input-error' : ''
						}`}
					/>
					{!!email.error && (
						<div className="label-text pt-1 text-error" id={email.errorId}>
							{email.error}
						</div>
					)}
				</div>
			</div>

			<div className="form-control">
				<label htmlFor={password.id} className="label">
					<span className="label-text">Password</span>
				</label>
				<div className="mt-1">
					<input
						{...conform.input(password, {
							type: 'password',
							ariaAttributes: true,
						})}
						autoComplete="current-password"
						className={`input-bordered input w-full ${
							password.error ? 'input-error' : ''
						}`}
					/>
					{password.error ? (
						<div className="label-text pt-1 text-error" id={password.errorId}>
							{password.error}
						</div>
					) : null}

					<PasswordForgottenLink />
				</div>
			</div>

			<input
				{...conform.input(redirectTo, {
					type: 'text',
					hidden: true,
					ariaAttributes: false,
				})}
			/>
			<button type="submit" className="btn-primary btn w-full">
				Log in
			</button>
			<div className="flex items-center justify-between">
				<div className="form-control">
					<label htmlFor={remember.id} className="label">
						<input
							{...conform.input(remember, {
								type: 'checkbox',
								ariaAttributes: false,
							})}
							className="checkbox-accent checkbox checkbox-sm"
						/>
						<span className="ml-2">Remember me</span>
					</label>
				</div>
			</div>
		</Form>
	)
}
