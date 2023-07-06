import crypto from 'node:crypto'
import { totp } from 'otplib'
import { HashAlgorithms } from 'otplib/core'
import * as base32 from 'thirty-two'

export function generateTOTP(
	digits = 6,
	secret = base32.encode(crypto.randomBytes(10)).toString(),
) {
	const algorithm = HashAlgorithms.SHA256
	const step = 60 * 10 // Ten minutes
	totp.options = { algorithm, digits, step, window: 0 }

	const otp = totp.generate(secret)
	const expiresAt = new Date(Date.now() + step * 1000)

	return { otp, secret, algorithm, expiresAt, step }
}

export function verifyTOTP(otp: string, secret: string, algorithm: string) {
	totp.options = { algorithm: algorithm as HashAlgorithms }
	return totp.verify({ token: otp, secret })
}
