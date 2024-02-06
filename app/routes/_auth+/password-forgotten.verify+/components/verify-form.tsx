import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
	Form,
	useActionData,
	useLoaderData,
	useSearchParams,
} from '@remix-run/react'
import useSubmitting from '~/hooks/submit'
import { Action, clientSchema } from '../action'
import { Loader } from '../loader'

export function VerifyForm() {
	const [searchParams] = useSearchParams()

	const actionData = useActionData<Action>()
	const loaderData = useLoaderData<Loader>()

	const lastSubmission = loaderData?.submission ?? actionData?.submission
	const isSubmitting = useSubmitting()

	const [form, { otp, email }] = useForm({
		constraint: getFieldsetConstraint(clientSchema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema: clientSchema })
		},
		id: 'verify-form',
		shouldRevalidate: 'onBlur',
		defaultValue: {
			otp: lastSubmission?.payload.otp ?? searchParams.get('otp') ?? '',
			email: lastSubmission?.payload.email ?? searchParams.get('email') ?? '',
		},
	})

	return (
		<Form method="POST" className="space-y-6" {...form.props}>
			<div className="form-control">
				<label htmlFor={email.id} className="label">
					<span className="label-text">Email Address</span>
				</label>
				<div className="mt-1">
					<input
						{...conform.input(email, {
							ariaAttributes: true,
							type: 'email',
						})}
						readOnly
						className={`input-bordered input w-full ${
							email.error ? 'input-error' : ''
						}`}
						autoComplete="email"
					/>
				</div>
				{!!email.error && (
					<div id={email.errorId} className="label-text text-error">
						{email.error}
					</div>
				)}
			</div>

			<div className="form-control">
				<label htmlFor={otp.id} className="label">
					<span className="label-text">OTP</span>
				</label>
				<div className="mt-1">
					<input
						{...conform.input(otp, {
							ariaAttributes: true,
						})}
						className={`input-bordered input w-full ${
							otp.error ? 'input-error' : ''
						}`}
						maxLength={6}
						autoFocus
					/>
				</div>
				{!!otp.error && (
					<div id={otp.errorId} className="label-text text-error">
						{otp.error}
					</div>
				)}
			</div>
			<button className="btn-primary btn w-full" disabled={isSubmitting}>
				validate your email
			</button>
		</Form>
	)
}
