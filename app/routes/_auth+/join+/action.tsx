import { parse } from '@conform-to/zod'
import { json, type ActionArgs } from '@remix-run/node'
import { z } from 'zod'
import { render } from '@react-email/render'
import { sendMail } from '~/utils/mailer.server'
import WelcomeEmail from './welcome.email.server'

import { type User, createUser, getUserByEmail } from '~/models/user.server'
import { safeRedirect } from '~/utils/redirect'
import { authenticator } from '~/utils/auth.server'
import { FormStrategy } from 'remix-auth-form'

export const schema = z.object({
	email: z.coerce.string().email('You must enter a valid mail address'),
	password: z.coerce.string().min(8, 'Password must be at least 8 characters'),
})

export const actionFn = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const submission = parse(formData, { schema })
	const redirectTo = safeRedirect(formData.get('redirectTo'), '/')

	if (!submission.value || submission.intent !== 'submit') {
		return json(submission, { status: 400 })
	}

	const existingUser = await getUserByEmail(submission.value.email)
	if (existingUser) {
		return json(
			{
				...submission,
				error: { email: 'A user already exists with this email' },
			},
			{ status: 400 },
		)
	}

	const user = await createUser(
		submission.value.email,
		submission.value.password,
	)

	await sendWelcomeEmail(user)

	return authenticator.authenticate(FormStrategy.name, request, {
		successRedirect: redirectTo,
		context: { formData },
	})
}

function sendWelcomeEmail(user: User) {
	const html = render(<WelcomeEmail username={user.email} />)
	const subject = 'Welcome to Nobu Stack!'

	return sendMail(user.email, subject, html)
}
