import { conform, useForm } from '@conform-to/react'
import {
	Form,
	Link,
	useActionData,
	useNavigation,
	useSearchParams,
} from '@remix-run/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { type V2_MetaFunction } from '@remix-run/node'

import { loaderFn } from './loader'
import { actionFn, schema } from './action'
import { useId } from 'react'

export const loader = loaderFn

export const action = actionFn

export const meta: V2_MetaFunction = () => [{ title: 'Password Forgotten' }]

export default function PasswordForgottenPage() {
	const id = useId()
	const [searchParams] = useSearchParams()
	const lastSubmission = useActionData<typeof action>()
	const { state } = useNavigation()

	const [form, { email }] = useForm({
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		shouldRevalidate: 'onBlur',
		id,
	})

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

					<div className="flex items-center justify-center pt-8">
						<p className="inline-block  px-2 text-sm text-slate-500">
							Remember your password?{' '}
							<Link
								prefetch="intent"
								className="link text-primary-focus"
								to={{ pathname: '/login', search: searchParams.toString() }}
							>
								Back to login
							</Link>
						</p>
					</div>
				</Form>
			</div>
		</div>
	)
}
