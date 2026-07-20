import { describe, expect, it } from "vitest"
import { capitalFirstChar } from "./util"

describe("toast util", () => {
  it("先頭文字だけを大文字化する", () => {
    expect(capitalFirstChar("topRight")).toBe("TopRight")
  })
})
