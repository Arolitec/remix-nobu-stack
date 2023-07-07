import { parse } from '@conform-to/zod'
import { json, redirect, type ActionArgs } from '@remix-run/node'
import { z } from 'zod'
import { resetPassword } from '~/utils/auth.server'
import { commitSession, getSession } from '~/utils/session.server'
import { RESET_PASSWORD_SESSION_KEY } from './constants'

export const schema = z
	.object({
		password: z.coerce
			.string()
			.min(8, 'Password must contains at least 8 characters'),
		passwordConfirm: z.coerce.string(),
	})
	.refine(data => data.password === data.passwordConfirm, {
		message: 'Password does not match',
		path: ['passwordConfirm'],
	})

export const actionFn = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const submission = parse(formData, { schema })

	if (!submission.value || submission.intent !== 'submit')
		return json(submission, { status: 400 })

	const { password } = submission.value
	const session = await getSession(request.headers.get('cookie'))
	const email = session.get(RESET_PASSWORD_SESSION_KEY)

	if (!email || typeof email !== 'string') return redirect('/login')

	await resetPassword(email, password)
	session.unset(RESET_PASSWORD_SESSION_KEY)

	return redirect('/login', {
		headers: {
			'Set-Cookie': await commitSession(session),
		},
	})
}
