import { parse } from '@conform-to/zod'
import type { User } from '@prisma/client'
import { ActionFunctionArgs, json } from '@remix-run/node'
import { FormStrategy } from 'remix-auth-form'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { authenticator, createUserSession } from '~/utils/auth.server'

import { safeRedirect } from '~/utils/redirect'

export const schema = z.object({
	email: z.coerce.string().email('You must enter a valid mail address'),
	password: z.coerce.string().min(1, 'You must enter a password'),
	redirectTo: z.coerce.string().min(1, 'Redirect URL is required'),
	remember: z.coerce.string().nullable(),
})

export const actionFn = async ({ request }: ActionFunctionArgs) => {
	const formData = await request.formData()
	const submission = parse(formData, { schema })

	const redirectTo = safeRedirect(submission.value?.redirectTo, '/')

	if (!submission.value || submission.intent !== 'submit')
		return json(
			{
				...submission,
				payload: { ...submission.payload, redirectTo },
			} as const,
			{ status: 400 },
		)

	try {
		const user = (await authenticator.authenticate(FormStrategy.name, request, {
			context: { formData },
			throwOnError: true,
		})) satisfies User | null

		invariant(user, 'User is required')

		return createUserSession({
			redirectTo,
			request,
			remember: submission.value.remember === 'on',
			user,
		} as const)
	} catch (e) {
		return json(
			{
				...submission,
				error: { '': 'Invalid email/password' },
			} as const,
			{ status: 400 },
		)
	}
}
