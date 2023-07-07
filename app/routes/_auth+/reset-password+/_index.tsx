import { conform, useForm } from '@conform-to/react'
import {
	Form,
	type V2_MetaFunction,
	useActionData,
	useLoaderData,
} from '@remix-run/react'
import { type LoaderArgs, json, redirect } from '@remix-run/node'
import { useId } from 'react'
import { getFieldsetConstraint, parse } from '@conform-to/zod'

import { requireAnonymous } from '~/utils/auth.server'
import { commitSession, getSession } from '~/utils/session.server'
import { RESET_PASSWORD_SESSION_KEY } from './constants'
import { actionFn, schema } from './action'

export const meta: V2_MetaFunction = () => [{ title: 'Reset Your Password' }]

export const loader = async ({ request }: LoaderArgs) => {
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

	return (
		<div className="flex min-h-full flex-col justify-center">
			<div className="mx-auto w-full max-w-sm px-8">
				<Form method="POST" className="space-y-6" {...form.props}>
					<p>{email}</p>
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
								autoComplete="off"
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
							<span className="label-text">Confirm password</span>
						</label>
						<div className="mt-1">
							<input
								{...conform.input(passwordConfirm, {
									type: 'password',
									ariaAttributes: true,
								})}
								autoComplete="off"
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

					<button className="btn-primary btn w-full">reset password</button>
				</Form>
			</div>
		</div>
	)
}
