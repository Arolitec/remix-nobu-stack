import { parse } from '@conform-to/zod'
import { json, type ActionArgs } from '@remix-run/node'
import { z } from 'zod'
import { createUser, getUserByEmail } from '~/models/user.server'
import { createUserSession } from '~/session.server'
import { safeRedirect } from '~/utils'

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

	return createUserSession({
		redirectTo,
		remember: false,
		request,
		userId: user.id,
	})
}
