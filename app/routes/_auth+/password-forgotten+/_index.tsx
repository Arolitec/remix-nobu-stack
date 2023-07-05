import { conform, useForm } from '@conform-to/react'
import { Form } from '@remix-run/react'
import { loaderFn } from './loader'

export const loader = loaderFn

export default function PasswordForgottenPage() {
	const [form, { email }] = useForm()

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

					<button className="btn-primary btn w-full" type="submit">
						send verification mail
					</button>
				</Form>
			</div>
		</div>
	)
}
