import { parse } from '@conform-to/zod'
import { json, redirect, type ActionArgs } from '@remix-run/node'
import { z } from 'zod'
import { prisma } from '~/utils/db.server'

export const schema = z.object({
	email: z.coerce.string().email(),
})

export const action = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const submission = parse(formData, { schema })

	if (!submission.value || submission.intent !== 'submit')
		return json(submission, { status: 400 })

	const { email } = submission.value
	const user = await prisma.user.findFirst({ where: { email } })

	if (!user) {
		// Redirect even if user does not exists
		// He won't be able to enter a valid OTP anyway
		redirect('/password-forgotten/verify')
	}

	// Generate OTP
	// Send Verification mail
	// Redirect to /password-forgotten/verify
}
