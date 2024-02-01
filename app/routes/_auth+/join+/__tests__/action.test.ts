import { User } from '@prisma/client'
import queue from '~/queues/send-welcome-mail/send-welcome-mail.server'
import { prisma } from '~/utils/db.server'
import { buildFormData } from '~/utils/form-data'
import action from '../action'

vi.mock('~/queues/send-welcome-mail/send-welcome-mail.server', () => {
	return {
		default: {
			enqueue: vi.fn(),
		},
	}
})

vi.mock('~/utils/db.server', async () => {
	return {
		prisma: {
			user: {
				findUnique: vi.fn(),
				createUser: vi.fn(),
			},
		},
	}
})

const DEFAULT_FORM_DATA = {
	email: 'test@example.com',
	password: 'password',
	redirectTo: '/',
}

function _buildFormData(data?: Record<string, string>) {
	return buildFormData({ ...DEFAULT_FORM_DATA, ...data })
}

describe('[join] action', () => {
	const mockedEnqueue = vi.mocked(queue.enqueue)
	const mockedCreateUser = vi.mocked(prisma.user.createUser)
	const mockedFindUnique = vi.mocked(prisma.user.findUnique)

	const mockUser = { id: '123' }

	beforeEach(() => {
		mockedEnqueue.mockResolvedValue({} as never)
	})

	afterEach(() => {
		vi.clearAllMocks()
	})

	it.concurrent(
		'should redirect to / if data are valid',
		async ({ expect }) => {
			mockedCreateUser.mockResolvedValue(mockUser as User)
			mockedFindUnique.mockResolvedValue(null)

			const body = _buildFormData()

			const request = new Request('http://test/join', {
				method: 'POST',
				body,
			})

			await expect(() =>
				action({
					request,
					context: {},
					params: {},
				}),
			).rejects.toThrow(Response)
		},
	)

	it('should queue mail after creating user', async () => {
		mockedCreateUser.mockResolvedValue(mockUser as User)
		mockedFindUnique.mockResolvedValue(null)

		const body = _buildFormData()

		const request = new Request('http://test/join', {
			method: 'POST',
			body,
		})

		await expect(() =>
			action({
				request,
				context: {},
				params: {},
			}),
		).rejects.toThrow(Response)

		expect(queue.enqueue).toHaveBeenCalledOnce()
		expect(queue.enqueue).toHaveBeenCalledWith(mockUser, { delay: '1s' })
	})

	it.concurrent(
		'should return a response with 400 status if email is already taken',
		async () => {
			mockedFindUnique.mockResolvedValue(mockUser as User)

			const body = _buildFormData()

			const request = new Request('http://test/join', {
				method: 'POST',
				body,
			})

			const response = await action({
				request,
				context: {},
				params: {},
			})

			expect(response).toBeInstanceOf(Response)
			expect(response.status).toBe(400)
		},
	)

	it.concurrent(
		'should return a response with status 400 if data are invalid',
		async () => {
			const request = new Request('http://test/join', {
				method: 'POST',
				body: new FormData(),
			})

			const response = await action({
				request,
				context: {},
				params: {},
			})

			expect(response).toBeInstanceOf(Response)
			expect(response.status).toBe(400)
		},
	)

	it('should return a response with status 400 if intent is not submit', async () => {
		const body = _buildFormData({ intent: 'test' })

		const request = new Request('http://test/join', {
			method: 'POST',
			body,
		})

		const response = await action({
			request,
			context: {},
			params: {},
		})

		expect(response.status).toBe(400)
	})
})
