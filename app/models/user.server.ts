import type { Password, User } from '@prisma/client'
import * as argon2 from 'argon2'
import invariant from 'tiny-invariant'

import { prisma } from '~/utils/db.server'

export type { User } from '@prisma/client'

const { ARGON_SECRET_KEY } = process.env

export async function getUserById(id: User['id']) {
	return prisma.user.findUnique({ where: { id } })
}

export async function getUserByEmail(email: User['email']) {
	return prisma.user.findUnique({ where: { email } })
}

export async function deleteUserByEmail(email: User['email']) {
	return prisma.user.delete({ where: { email } })
}

export async function verifyLogin(
	email: User['email'],
	password: Password['hash'],
) {
	const userWithPassword = await prisma.user.findUnique({
		where: { email },
		include: {
			password: true,
		},
	})

	if (!userWithPassword || !userWithPassword.password) {
		return null
	}

	invariant(ARGON_SECRET_KEY, 'ARGON_SECRET_KEY env var must be set')
	const isValid = await argon2.verify(
		userWithPassword.password.hash,
		password,
		{ secret: Buffer.from(ARGON_SECRET_KEY) },
	)

	if (!isValid) {
		return null
	}

	const { password: _password, ...userWithoutPassword } = userWithPassword

	return userWithoutPassword
}
