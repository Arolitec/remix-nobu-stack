import { parse } from '@conform-to/zod'
import { json, type ActionArgs } from '@remix-run/node'
import z from 'zod'
import { verifyLogin } from '~/models/user.server'
import { createUserSession } from '~/session.server'

import { safeRedirect } from '~/utils'

export const schema = z.object({
	email: z.coerce.string().email('You must enter a valid mail address'),
	password: z.coerce.string().min(1, 'You must enter a password'),
	redirectTo: z.coerce.string().min(1, 'Redirect URL is required'),
	remember: z.coerce.string().nullable(),
})

export const actionFn = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const submission = parse(formData, { schema })

	const redirectTo = safeRedirect(submission.value?.redirectTo, '/')

	if (!submission.value || submission.intent !== 'submit')
		return json(
			{
				...submission,
				payload: { ...submission.payload, redirectTo },
			},
			{ status: 400 },
		)

	const user = await verifyLogin(
		submission.value.email,
		submission.value.password,
	)

	if (!user) {
		return json(
			{
				...submission,
				error: { '': 'Invalid email/password' },
			},
			{ status: 400 },
		)
	}

	return createUserSession({
		redirectTo,
		remember: submission.value.remember === 'on' ? true : false,
		request,
		userId: user.id,
	})
}
