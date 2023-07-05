import crypto from 'node:crypto'
import { totp } from 'otplib'
import { HashAlgorithms } from 'otplib/core'
import * as base32 from 'thirty-two'

export function generateTOTP(
	secret = base32.encode(crypto.randomBytes(10)).toString(),
	digits = 6,
) {
	const algorithm = HashAlgorithms.SHA256
	const step = 60 * 10 // Ten minutes
	totp.options = { algorithm, digits, step, window: 0 }

	const otp = totp.generate(secret)
	return { otp, secret, algorithm }
}

export function verifyTOTP(otp: string, secret: string, algorithm: string) {
	totp.options = { algorithm: algorithm as HashAlgorithms }
	return totp.verify({ token: otp, secret })
}
