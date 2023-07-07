import { Prisma, PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'
import invariant from 'tiny-invariant'

let prisma: PrismaClient

declare global {
	var __db__: PrismaClient
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === 'production') {
	prisma = getClient()
} else {
	if (!global.__db__) {
		global.__db__ = getClient()
	}
	prisma = global.__db__
}

function getClient() {
	const { DATABASE_URL, PRISMA_LOG_LEVEL } = process.env
	invariant(typeof DATABASE_URL === 'string', 'DATABASE_URL env var not set')

	const client = new PrismaClient({
		log: PRISMA_LOG_LEVEL?.split(',') as Prisma.LogLevel[],
	})
	// connect eagerly
	client.$connect()

	return client
}

// Prisma Extension.
// See https://www.prisma.io/docs/concepts/components/prisma-client/client-extensions
// See https://www.prisma.io/blog/client-extensions-preview-8t3w27xkrxxn#the-components-of-an-extension

const createUserExt = Prisma.defineExtension({
	name: 'createUser',
	model: {
		user: {
			async createUser(email: string, password: string) {
				const { ARGON_SECRET_KEY } = process.env
				invariant(ARGON_SECRET_KEY, 'ARGON_SECRET_KEY env var must be set')

				const hashedPassword = await argon2.hash(password, {
					secret: Buffer.from(ARGON_SECRET_KEY),
				})

				return prisma.user.create({
					data: {
						email,
						password: {
							create: {
								hash: hashedPassword,
							},
						},
					},
				})
			},
		},
	},
})

const resetPasswordExt = Prisma.defineExtension({
	name: 'resetPassword',
	model: {
		user: {
			async resetPassword(email: string, password: string) {
				const { ARGON_SECRET_KEY } = process.env
				invariant(ARGON_SECRET_KEY, 'ARGON_SECRET_KEY env var must be set')

				const hashedPassword = await argon2.hash(password, {
					secret: Buffer.from(ARGON_SECRET_KEY),
				})

				return prisma.user.update({
					where: { email },
					data: {
						password: {
							update: {
								hash: hashedPassword,
							},
						},
					},
				})
			},
		},
	},
})

const xprisma = prisma.$extends(createUserExt).$extends(resetPasswordExt)

export { prisma, xprisma }
