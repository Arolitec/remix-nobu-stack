import { conform, useForm } from '@conform-to/react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'
import {
	LoaderFunctionArgs,
	MetaFunction,
	json,
	redirect,
} from '@remix-run/node'
import {
	Form,
	useActionData,
	useLoaderData,
	useNavigation,
} from '@remix-run/react'
import { useId } from 'react'
import { actionFn, schema } from './action'
import { RESET_PASSWORD_SESSION_KEY } from './constants'

import { GeneralErrorBoundary } from '~/components/error-boundary'
import { requireAnonymous } from '~/utils/auth.server'
import { commitSession, getSession } from '~/utils/session.server'

export const meta: MetaFunction = () => [{ title: 'Reset Your Password' }]

export const loader = async ({ request }: LoaderFunctionArgs) => {
	await requireAnonymous(request)

	const session = await getSession(request.headers.get('cookie'))
	const email = session.get(RESET_PASSWORD_SESSION_KEY)

	if (!email || typeof email !== 'string') return redirect('/')

	return json(
		{ email },
		{ headers: { 'Set-Cookie': await commitSession(session) } },
	)
}

export const action = actionFn

export default function ResetPasswordPage() {
	const { email } = useLoaderData<typeof loader>()
	const lastSubmission = useActionData<typeof action>()
	const { state } = useNavigation()

	const id = useId()
	const [form, { password, passwordConfirm }] = useForm({
		id,
		lastSubmission,
		onValidate({ formData }) {
			return parse(formData, { schema })
		},
		shouldRevalidate: 'onBlur',
		constraint: getFieldsetConstraint(schema),
	})

	const isSubmitting = ['loading', 'submitting'].includes(state)

	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-sm px-8">
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
								<div
									className="label-text pt-1 text-error"
									id={password.errorId}
								>
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
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
