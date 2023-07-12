import { parse } from '@conform-to/zod'
import { render } from '@react-email/render'
import { FormStrategy } from 'remix-auth-form'
import { z } from 'zod'
import WelcomeEmail from './welcome.email.server'
import { json, type ActionArgs } from '@remix-run/node'
import { sendMail } from '~/utils/mailer.server'
import { type User } from '@prisma/client'
import { safeRedirect } from '~/utils/redirect'
import { authenticator } from '~/utils/auth.server'
import { xprisma } from '~/utils/db.server'

export const clientSchema = z.object({
	email: z.coerce.string().email('You must enter a valid mail address'),
	password: z.coerce.string().min(8, 'Password must be at least 8 characters'),
})

const schema = clientSchema.superRefine(async (data, ctx) => {
	const { email } = data

	const existingUser = await xprisma.user.findUnique({
		where: { email: email },
	})

	if (existingUser) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'A user already exists with this email',
			path: ['email'],
		})
		return
	}
})

export const actionFn = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const submission = await parse(formData, {
		schema,
		acceptMultipleErrors: () => true,
		async: true,
	})
	const redirectTo = safeRedirect(formData.get('redirectTo'), '/')

	if (!submission.value || submission.intent !== 'submit') {
		return json(submission, { status: 400 })
	}

	const user = await xprisma.user.createUser(
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
