import { installGlobals } from '@remix-run/node'

import { prisma } from '~/utils/db.server'
import { generateTOTP } from '~/utils/otp.server'

installGlobals()

async function createVerification(email: string) {
	console.log(
		'🚀 ~ file: create-verification.ts:8 ~ createVerification ~ email:',
		email,
	)
	const otpData = generateTOTP()
	await prisma.verification.create({
		data: {
			algorithm: otpData.algorithm,
			digits: 6,
			email,
			period: otpData.step,
			expiresAt: otpData.expiresAt,
			secret: otpData.secret,
		},
	})
	console.log(`<otp>${otpData.otp}</otp>`.trim())
}

createVerification(process.argv[2])
