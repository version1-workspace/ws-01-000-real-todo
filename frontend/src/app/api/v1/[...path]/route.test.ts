import { afterEach, describe, expect, it, vi } from "vitest"
import { DELETE, GET, POST } from "./route"

const context = (path: string[]) => ({ params: Promise.resolve({ path }) })

describe("API proxy route", () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  it("query、認証、refreshToken と raw body を固定 upstream に中継する", async () => {
    vi.stubEnv("API_BASE_URL", "http://localhost:3001/api/v1")
    const fetchMock = vi.fn(async (input: URL, init: RequestInit) => {
      expect(input.toString()).toBe("http://localhost:3001/api/v1/users/me?page=2")
      expect(init.method).toBe("POST")
      const requestHeaders = new Headers(init.headers)
      expect(requestHeaders.get("authorization")).toBe("Bearer access-token")
      expect(requestHeaders.get("cookie")).toBe("refreshToken=refresh-token")
      expect(init.redirect).toBe("manual")
      expect(await new Response(init.body).text()).toBe('{"name":"Turvo"}')
      return new Response('{"data":true}', {
        headers: { "Content-Type": "application/json" },
      })
    })
    vi.stubGlobal("fetch", fetchMock)

    const response = await POST(
      new Request("http://localhost:3000/api/v1/users/me?page=2", {
        method: "POST",
        headers: {
          Authorization: "Bearer access-token",
          Cookie: "refreshToken=refresh-token; unrelated=do-not-forward",
          "Content-Type": "application/json",
          Origin: "http://localhost:3000",
        },
        body: '{"name":"Turvo"}',
      }),
      context(["users", "me"]),
    )

    expect(response.status).toBe(200)
    expect(response.headers.get("cache-control")).toBe("no-store")
  })

  it("複数の Set-Cookie を個別に透過する", async () => {
    vi.stubEnv("API_BASE_URL", "https://api.example.test/api/v1")
    const headers = new Headers()
    headers.append("Set-Cookie", "refreshToken=rotated; HttpOnly")
    headers.append("Set-Cookie", "another=value; HttpOnly")
    vi.stubGlobal("fetch", vi.fn(async () => new Response(null, { headers })))

    const response = await GET(
      new Request("https://app.example.test/api/v1/auth/refresh"),
      context(["auth", "refresh"]),
    )

    expect(response.headers.getSetCookie()).toEqual([
      "refreshToken=rotated; HttpOnly",
      "another=value; HttpOnly",
    ])
  })

  it("401 の Cookie 削除も status とともに透過する", async () => {
    vi.stubEnv("API_BASE_URL", "https://api.example.test/api/v1")
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response('{"message":"Unauthorized"}', {
            status: 401,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": "refreshToken=; Max-Age=0; HttpOnly; SameSite=Lax",
            },
          }),
      ),
    )

    const response = await GET(
      new Request("https://app.example.test/api/v1/users/me"),
      context(["users", "me"]),
    )

    expect(response.status).toBe(401)
    expect(response.headers.getSetCookie()).toEqual([
      "refreshToken=; Max-Age=0; HttpOnly; SameSite=Lax",
    ])
  })

  it("logout の Cookie 削除を DELETE の成功レスポンスでも透過する", async () => {
    vi.stubEnv("API_BASE_URL", "https://api.example.test/api/v1")
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(null, {
            headers: {
              "Set-Cookie": "refreshToken=; Max-Age=0; HttpOnly; SameSite=Lax",
            },
          }),
      ),
    )

    const response = await DELETE(
      new Request("https://app.example.test/api/v1/auth/refresh", {
        method: "DELETE",
        headers: { Origin: "https://app.example.test" },
      }),
      context(["auth", "refresh"]),
    )

    expect(response.status).toBe(200)
    expect(response.headers.getSetCookie()).toEqual([
      "refreshToken=; Max-Age=0; HttpOnly; SameSite=Lax",
    ])
  })

  it("未設定または危険な upstream 設定を 500 にする", async () => {
    vi.stubEnv("API_BASE_URL", "https://token@example.test/api/v1")
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const response = await GET(
      new Request("http://localhost:3000/api/v1/users/me"),
      context(["users", "me"]),
    )

    expect(response.status).toBe(500)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("path traversal を upstream に転送しない", async () => {
    vi.stubEnv("API_BASE_URL", "http://localhost:3001/api/v1")
    const fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)

    const response = await GET(
      new Request("http://localhost:3000/api/v1/ignored"),
      context(["..", "users"]),
    )

    expect(response.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("upstream timeout を 504 として返す", async () => {
    vi.stubEnv("API_BASE_URL", "http://localhost:3001/api/v1")
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new DOMException("aborted", "AbortError")
      }),
    )

    const response = await GET(
      new Request("http://localhost:3000/api/v1/users/me"),
      context(["users", "me"]),
    )

    expect(response.status).toBe(504)
  })

  it("response body の受信中 timeout も 504 として返す", async () => {
    vi.useFakeTimers()
    vi.stubEnv("API_BASE_URL", "http://localhost:3001/api/v1")
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: URL, init: RequestInit) => {
        const body = new ReadableStream({
          start(controller) {
            init.signal?.addEventListener("abort", () => {
              controller.error(new DOMException("aborted", "AbortError"))
            })
          },
        })
        return new Response(body)
      }),
    )

    const responsePromise = GET(
      new Request("http://localhost:3000/api/v1/users/me"),
      context(["users", "me"]),
    )
    await vi.advanceTimersByTimeAsync(10_000)

    await expect(responsePromise).resolves.toMatchObject({ status: 504 })
  })

  it("クロスサイトの変更リクエストを拒否する", async () => {
    vi.stubEnv("API_BASE_URL", "http://localhost:3001/api/v1")
    const response = await POST(
      new Request("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { Origin: "https://attacker.example" },
      }),
      context(["auth", "login"]),
    )

    expect(response.status).toBe(403)
  })
})
