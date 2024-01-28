import useSubmitting from "./submit"
import { renderHook } from "@testing-library/react"
import { useNavigation } from "@remix-run/react"
import type { Mock } from "vitest"

vi.mock("@remix-run/react", async (importModule) => ({
  ...await importModule(),
  useNavigation: vi.fn(),
}))

describe("useSubmitting", () => {
  it('should return true if page is submitting', async () => {
    (useNavigation as Mock).mockReturnValue({ state: 'submitting' })

    const { result } = renderHook(() => useSubmitting())

    expect(result.current).toBe(true)
  })

  it('should return true if page is loading', async () => {
    (useNavigation as Mock).mockReturnValue({ state: 'loading' })

    const { result } = renderHook(() => useSubmitting())

    expect(result.current).toBe(true)
  })

  it('should return false if page is not submitting', async () => {
    (useNavigation as Mock).mockReturnValue({ state: 'idle' })

    const { result } = renderHook(() => useSubmitting())

    expect(result.current).toBe(false)
  })
})
