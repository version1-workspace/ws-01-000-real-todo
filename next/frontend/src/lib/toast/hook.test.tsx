import { act, renderHook } from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { ToastContext } from "./index"
import { useToast } from "./hook"

describe("useToast", () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it("info で push して duration 後に remove する", () => {
    vi.useFakeTimers()
    const push = vi.fn(() => 10)
    const remove = vi.fn()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastContext.Provider value={{ push, remove }}>
        {children}
      </ToastContext.Provider>
    )

    const { result } = renderHook(() => useToast(), { wrapper })

    act(() => {
      result.current.info("hello", { duration: 1000 })
    })

    expect(push).toHaveBeenCalledWith({
      variant: "info",
      message: "hello",
    })
    expect(remove).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(remove).toHaveBeenCalledWith(10)
  })

  it("success と error で対応する variant を渡す", () => {
    const push = vi.fn(() => 20)
    const remove = vi.fn()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastContext.Provider value={{ push, remove }}>
        {children}
      </ToastContext.Provider>
    )

    const { result } = renderHook(() => useToast(), { wrapper })

    act(() => {
      result.current.success("ok", { duration: 1 })
      result.current.error("ng", { duration: 1 })
    })

    expect(push).toHaveBeenNthCalledWith(1, {
      variant: "success",
      message: "ok",
    })
    expect(push).toHaveBeenNthCalledWith(2, {
      variant: "error",
      message: "ng",
    })
  })
})
