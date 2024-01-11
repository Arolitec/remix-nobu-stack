import { faker } from '@faker-js/faker'

export function generateUserCredentials(email?: string, password?: string) {
	return {
		email: email ?? faker.internet.email(),
		password:
			password ?? faker.internet.password({ length: 8, memorable: false }),
	}
}
