import { conform, useForm } from '@conform-to/react'
import { Form, useActionData, useNavigation } from '@remix-run/react'
import { parse } from '@conform-to/zod'

import { loaderFn } from './loader'
import { actionFn, schema } from './action'
import { useId } from 'react'

export const loader = loaderFn

export const action = actionFn

export default function PasswordForgottenPage() {
	const id = useId()
	const lastSubmission = useActionData<typeof action>()
	const [form, { email }] = useForm({
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		shouldValidate: 'onBlur',
		id,
	})

	const { state } = useNavigation()
	const isSubmitting = ['loading', 'submitting'].includes(state)


	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-md px-8">
				<Form method="POST" className="space-y-6" {...form.props}>
					<div className="form-control">
						<label htmlFor={email.id}>
							<span className="label-text">Email address</span>
						</label>
						<div className="mt-1">
							<input
								autoComplete="email"
								required
								autoFocus
								{...conform.input(email, { ariaAttributes: true })}
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

					<button
						className="btn-primary btn w-full"
						type="submit"
						disabled={isSubmitting}
					>
						{isSubmitting ? 'please wait...' : 'send verification mail'}
					</button>
				</Form>
			</div>
		</div>
	)
}
