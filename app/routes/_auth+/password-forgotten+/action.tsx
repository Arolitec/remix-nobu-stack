import { parse } from '@conform-to/zod'
import { render } from '@react-email/render'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import VerifyEmail from './verify.email.server'
import { json, type ActionArgs } from '@remix-run/node'
import { type User } from '@prisma/client'
import { prisma } from '~/utils/db.server'
import { sendMail } from '~/utils/mailer.server'
import { generateTOTP } from '~/utils/otp.server'
import { getDomain } from '~/utils/url.server'

export const schema = z.object({
	email: z.coerce.string().email('You must enter a valid mail address'),
})

export const actionFn = async ({ request }: ActionArgs) => {
	const formData = await request.formData()
	const submission = parse(formData, { schema })

	if (!submission.value || submission.intent !== 'submit')
		return json({ submission, ok: false } as const, { status: 400 })

	const { email } = submission.value
	const user = await prisma.user.findFirst({ where: { email } })

	if (!user) {
		// Early return if user does not exists
		// He won't be able to enter a valid OTP anyway
		return json({ ok: true, submission: undefined } as const)
	}

	invariant(user, 'User must be defined')

	// A user should have only one pending verification at a time
	await prisma.verification.deleteMany({
		where: { email },
	})

	const digits = 6
	const { otp, algorithm, secret, expiresAt, step } = generateTOTP(digits)
	await prisma.verification.create({
		data: { algorithm, expiresAt, period: step, secret, digits, email },
	})

	const verifyLink = new URL(`${getDomain(request)}/password-forgotten/verify`)
	verifyLink.searchParams.set('otp', otp)
	verifyLink.searchParams.set('email', email)

	await sendVerifyEmail(user, { otp, verifyLink: verifyLink.toString() })

	return json({ ok: true, submission: undefined } as const)
}

function sendVerifyEmail(
	user: User,
	props: { otp: string; verifyLink: string },
) {
	const html = render(<VerifyEmail {...props} />)
	const subject = 'Email verification'

	return sendMail(user.email, subject, html)
}
