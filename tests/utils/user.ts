import { faker } from '@faker-js/faker'

export function generateUserCredentials(email?: string, password?: string) {
	if (!email.endsWith('@example.com')) {
		throw new Error('Email must be an example.com email')
	}

	return {
		email: email ?? faker.internet.email({ provider: 'example.com' }),
		password:
			password ?? faker.internet.password({ length: 8, memorable: false }),
	}
}
