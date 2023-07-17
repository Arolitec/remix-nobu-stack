import { parse } from '@conform-to/zod'
import { type User } from '@prisma/client'
import { render } from '@react-email/render'
import { json, type ActionArgs } from '@remix-run/node'
import { FormStrategy } from 'remix-auth-form'
import { z } from 'zod'
import { authenticator } from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { sendMail } from '~/utils/mailer.server'
import { safeRedirect } from '~/utils/redirect'
import WelcomeEmail from './welcome.email.server'

export const clientSchema = z.object({
	email: z.coerce.string().email('You must enter a valid mail address'),
	password: z.coerce.string().min(8, 'Password must be at least 8 characters'),
})

const schema = clientSchema.superRefine(async (data, ctx) => {
	const { email } = data

	const existingUser = await prisma.user.findUnique({
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

	const user = await prisma.user.createUser(
		submission.value.email,
		submission.value.password,
	)

	sendWelcomeEmail(user)

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
