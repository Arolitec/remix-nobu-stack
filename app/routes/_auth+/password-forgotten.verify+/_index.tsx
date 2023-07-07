import { conform, useForm } from '@conform-to/react'
import {
	Form,
	useActionData,
	useNavigation,
	useSearchParams,
} from '@remix-run/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'

import { actionFn, clientSchema } from './action'
import { useId } from 'react'
import { type LoaderArgs, type V2_MetaFunction, json } from '@remix-run/node'
import { requireAnonymous } from '~/utils/auth.server'

export const meta: V2_MetaFunction = () => [{ title: 'Verify Your Email' }]

export const loader = async ({ request }: LoaderArgs) => {
	await requireAnonymous(request)

	return json({})
}

export const action = actionFn

export default function VerifyPage() {
	const [searchParams] = useSearchParams()
	const { state } = useNavigation()
	const id = useId()

	const lastSubmission = useActionData<typeof action>()

	const [form, { otp, email }] = useForm({
		constraint: getFieldsetConstraint(clientSchema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema: clientSchema })
		},
		id,
		shouldRevalidate: 'onBlur',
		defaultValue: {
			otp: searchParams.get('otp') ?? '',
			email: searchParams.get('email') ?? '',
		},
	})

	const isSubmitting = ['loading', 'submitting'].includes(state)

	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-sm px-8">
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
			</div>
		</div>
	)
}
