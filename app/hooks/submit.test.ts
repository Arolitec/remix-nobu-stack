import { useNavigation } from '@remix-run/react'
import { renderHook } from '@testing-library/react'
import type { Mock } from 'vitest'
import useSubmitting from './submit'

vi.mock('@remix-run/react', async importModule => ({
	...(await importModule()),
	useNavigation: vi.fn(),
}))

describe('useSubmitting', () => {
	it('should return true if page is submitting', async () => {
		;(useNavigation as Mock).mockReturnValue({ state: 'submitting' })

		const { result } = renderHook(() => useSubmitting())

		expect(result.current).toBe(true)
	})

	it('should return false if page is loading', async () => {
		;(useNavigation as Mock).mockReturnValue({ state: 'loading' })

		const { result } = renderHook(() => useSubmitting())

		expect(result.current).toBe(false)
	})

	it('should return false if page is not submitting', async () => {
		;(useNavigation as Mock).mockReturnValue({ state: 'idle' })

		const { result } = renderHook(() => useSubmitting())

		expect(result.current).toBe(false)
	})
})
