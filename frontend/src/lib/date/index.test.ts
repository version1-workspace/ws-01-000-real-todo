import { describe, expect, it, vi } from "vitest"
import { AppDate, AppDateTime } from "./index"

describe("date", () => {
  it("AppDate.now で今日の日付を返す", () => {
    vi.setSystemTime(new Date("2026-04-12T00:00:00Z"))

    expect(AppDate.now().toString()).toBe("2026-04-12")
  })

  it("AppDate.in で日付を加算する", () => {
    vi.setSystemTime(new Date("2026-04-12T00:00:00Z"))

    expect(AppDate.in(3).toString()).toBe("2026-04-15")
  })

  it("AppDateTime.now はインスタンスを返す", () => {
    expect(AppDateTime.now()).toBeInstanceOf(AppDateTime)
  })
})
