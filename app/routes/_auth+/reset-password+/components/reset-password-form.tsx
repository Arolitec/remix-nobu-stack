import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { Form, useActionData, useLoaderData } from '@remix-run/react'
import useSubmitting from '~/hooks/submit'
import { schema, type Action } from '../action'
import { type Loader } from '../loader'

export function ResetPasswordForm() {
	const { email } = useLoaderData<Loader>()
	const lastSubmission = useActionData<Action>()

	const [form, { password, passwordConfirm }] = useForm({
		id: 'reset-password-form',
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		shouldRevalidate: 'onBlur',
		constraint: getFieldsetConstraint(schema),
	})

	const isSubmitting = useSubmitting()

	return (
		<Form method="POST" className="space-y-6" {...form.props}>
			<p>{email}</p>
			<div className="form-control">
				<label htmlFor={password.id} className="label">
					<span className="label-text">New password</span>
				</label>
				<div className="mt-1">
					<input
						{...conform.input(password, {
							type: 'password',
							ariaAttributes: true,
						})}
						autoComplete="new-password"
						className={`input-bordered input w-full ${
							password.error ? 'input-error' : ''
						}`}
					/>
					{!!password.error && (
						<div className="label-text pt-1 text-error" id={password.errorId}>
							{password.error}
						</div>
					)}
				</div>
			</div>

			<div className="form-control">
				<label htmlFor={passwordConfirm.id} className="label">
					<span className="label-text">Confirm new password</span>
				</label>
				<div className="mt-1">
					<input
						{...conform.input(passwordConfirm, {
							type: 'password',
							ariaAttributes: true,
						})}
						autoComplete="new-password"
						className={`input-bordered input w-full ${
							passwordConfirm.error ? 'input-error' : ''
						}`}
					/>
					{!!passwordConfirm.error && (
						<div
							className="label-text pt-1 text-error"
							id={passwordConfirm.errorId}
						>
							{passwordConfirm.error}
						</div>
					)}
				</div>
			</div>

			<button className="btn-primary btn w-full" disabled={isSubmitting}>
				reset password
			</button>
		</Form>
	)
}
