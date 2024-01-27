import type { Mock } from 'vitest'
import action from '../action'
import queue from '~/queues/send-welcome-mail/send-welcome-mail.server'
import { prisma } from '~/utils/db.server'

vi.mock('~/queues/send-welcome-mail/send-welcome-mail.server', () => {
  return {
    default: {
      enqueue: vi.fn()
    },
  }
})


vi.mock('~/utils/db.server', async () => {
  return {
    prisma: {
      user: {
        findUnique: vi.fn(),
        createUser: vi.fn()
      }
    }
  }
})

describe("[join] action", () => {
  const body = new FormData()
  body.append('email', 'test@example.com')
  body.append('password', 'password')
  body.append('intent', 'submit')

  const mockUser = { id: '123' }

  beforeEach(() => {
    (queue.enqueue as Mock).mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it.concurrent('should redirect to / if data are valid', async ({ expect }) => {
    (prisma.user.createUser as Mock).mockResolvedValue(mockUser);
    (prisma.user.findUnique as Mock).mockResolvedValue(null)

    const request = new Request('http://test/join', {
      method: 'POST',
      body
    })

    await expect(() => action({
      request,
      context: {},
      params: {}
    })).rejects.toThrow(Response)
  })

  it('should queue mail after creating user', async () => {
    (prisma.user.createUser as Mock).mockResolvedValue(mockUser);
    (prisma.user.findUnique as Mock).mockResolvedValue(null)

    const request = new Request('http://test/join', {
      method: 'POST',
      body
    })

    await expect(() => action({
      request,
      context: {},
      params: {}
    })).rejects.toThrow(Response)

    expect(queue.enqueue).toHaveBeenCalledOnce()
    expect(queue.enqueue).toHaveBeenCalledWith(mockUser, { delay: '1s' })
  })

  it.concurrent('should return a response with 400 status if email is already taken', async () => {
    (prisma.user.findUnique as Mock).mockResolvedValue(mockUser)

    const request = new Request('http://test/join', {
      method: 'POST',
      body
    })

    const response = await action({
      request,
      context: {},
      params: {}
    })

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(400)
  })

  it.concurrent('should return a response with status 400 if data are invalid', async () => {
    const request = new Request('http://test/join', {
      method: 'POST',
      body: new FormData()
    })

    const response = await action({
      request,
      context: {},
      params: {}
    })

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(400)
  })
})
