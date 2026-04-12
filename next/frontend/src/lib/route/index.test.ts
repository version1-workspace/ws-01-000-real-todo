import { describe, expect, it } from "vitest"
import route from "./index"

describe("route", () => {
  it("ネストしたパスを構築できる", () => {
    expect(route.main.projects.toString()).toBe("/main/projects")
  })

  it("with で任意のセグメントを追加できる", () => {
    expect(route.main.tasks.with("123")).toBe("/main/tasks/123")
  })
})
