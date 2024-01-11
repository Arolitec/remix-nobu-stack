import { faker } from '@faker-js/faker'
import execa from 'execa'
import { prisma } from '~/utils/db.server'
import { generateTOTP } from '~/utils/otp.server'

class DatabaseSetup {
	user: UserDb
	verification: VerificationDb

	constructor() {
		this.user = new UserDb()
		this.verification = new VerificationDb()
	}

	public async setup() {
		await execa('yarn', ['prisma', 'migrate', 'reset', '-f'], {
			stdio: 'inherit',
		})
	}
}

class UserDb {
	public async create(
		email = faker.internet.email(),
		password = faker.internet.password(),
	) {
		return prisma.user.createUser(email, password)
	}

	public async createMany(count = 1) {
		const promises$ = Array.from({ length: count }).map(() => this.create())
		return Promise.all(promises$)
	}

	public async cleanUp() {
		return prisma.user.deleteMany()
	}
}

class VerificationDb {
	public async create(email: string) {
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

		return otpData.otp
	}
}

export { DatabaseSetup }
