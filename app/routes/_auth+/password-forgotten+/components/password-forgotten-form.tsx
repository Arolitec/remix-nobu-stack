import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import { CheckCircledIcon } from '@radix-ui/react-icons'
import { Link, useFetcher, useSearchParams } from '@remix-run/react'
import { schema, type Action } from '../action'

export function PasswordForgottenForm() {
	const [searchParams] = useSearchParams()
	const passwordForgotten = useFetcher<Action>()

	const lastSubmission = passwordForgotten.data
		? passwordForgotten.data.submission
		: undefined

	const [form, { email }] = useForm({
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		shouldRevalidate: 'onBlur',
		id: 'password-forgotten-form',
	})

	const isSubmitting = ['submitting'].includes(passwordForgotten.state)

	return (
		<>
			{passwordForgotten.state === 'idle' && !passwordForgotten.data?.ok ? (
				<passwordForgotten.Form
					method="POST"
					className="space-y-6"
					action="."
					{...form.props}
				>
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
				</passwordForgotten.Form>
			) : (
				<div className="alert alert-success">
					<CheckCircledIcon className="h-[2rem] w-[2rem]" role="img" />
					<span>
						We have sent you an e-mail with instructions to reset your password.
					</span>
				</div>
			)}
		</>
	)
}
