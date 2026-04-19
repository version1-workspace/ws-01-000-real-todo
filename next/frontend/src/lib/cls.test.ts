import { describe, expect, it } from "vitest"
import { classHelper, join } from "./cls"

describe("cls", () => {
  it("truthy なキーだけを className に含める", () => {
    expect(classHelper({ active: true, hidden: false, loading: true })).toBe(
      " active loading",
    )
  })

  it("join で未定義値を含む文字列を連結する", () => {
    expect(join("button", undefined, "primary")).toBe("button primary")
  })
})
