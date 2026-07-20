import { describe, expect, it } from "vitest"
import { QueryString } from "./index"
import { parse } from "./parser"
import { stringify } from "./stringifier"

describe("queryString", () => {
  it("文字列をオブジェクトへ parse できる", () => {
    expect(parse("page=1&filter[status]=active&tags[]=a&tags[]=b")).toEqual({
      page: "1",
      filter: { status: "active" },
      tags: ["a", "b"],
    })
  })

  it("ネストしたオブジェクトを stringify できる", () => {
    expect(
      stringify({
        page: 1,
        filter: { status: "active" },
        tags: ["a", "b"],
      }),
    ).toBe("page=1&filter[status]=active&tags[]=a&tags[]=b")
  })

  it("文字列を渡した QueryString を扱える", () => {
    const query = new QueryString("page=1&filter[status]=active")

    expect(query.object).toEqual({
      page: "1",
      filter: { status: "active" },
    })
    expect(query.toString()).toBe("page=1&filter[status]=active")
  })

  it("URLSearchParams を渡した QueryString を扱える", () => {
    const query = new QueryString(
      new URLSearchParams([
        ["page", "2"],
        ["status[]", "scheduled"],
        ["status[]", "completed"],
      ]),
    )

    expect(query.object).toEqual({
      page: "2",
      status: ["scheduled", "completed"],
    })
  })
})
