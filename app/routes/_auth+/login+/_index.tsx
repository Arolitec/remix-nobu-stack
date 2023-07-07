import type { V2_MetaFunction } from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { useId } from 'react'
import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'

import { actionFn, schema } from './action'
import { loaderFn } from './loader'

export const loader = loaderFn

export const action = actionFn

export const meta: V2_MetaFunction = () => [{ title: 'Login' }]

export default function LoginPage() {
	const [searchParams] = useSearchParams()
	const id = useId()
	const lastSubmission = useActionData<typeof action>()

	const [form, { email, password, redirectTo, remember }] = useForm({
		constraint: getFieldsetConstraint(schema),
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		id,
		shouldRevalidate: 'onBlur',
		defaultValue: {
			redirectTo: searchParams.get('redirectTo') ?? '/',
		},
	})

	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-md px-8">
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
								<div
									className="label-text pt-1 text-error"
									id={password.errorId}
								>
									{password.error}
								</div>
							) : null}

							<label className="label justify-end">
								<span className="label-text-alt">
									Password forgotten?{' '}
									<Link
										prefetch="intent"
										className="link-secondary link"
										to="/password-forgotten"
									>
										Reset
									</Link>
								</span>
							</label>
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
					<div className="flex items-center justify-center pt-8">
						<p className="inline-block  px-2 text-sm text-slate-500">
							Don't have an account yet?{' '}
							<Link
								prefetch="intent"
								className="link text-primary-focus"
								to={{ pathname: '/join', search: searchParams.toString() }}
							>
								Create one
							</Link>
						</p>
					</div>
				</Form>
			</div>
		</div>
	)
}
