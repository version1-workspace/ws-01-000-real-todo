import { describe, expect, it } from "vitest"
import { truncate } from "./index"

describe("string", () => {
  it("指定長以下ならそのまま返す", () => {
    expect(truncate("hello", 5)).toBe("hello")
  })

  it("長い文字列を切り詰める", () => {
    expect(truncate("hello world", 5)).toBe("hello ...")
  })
})
