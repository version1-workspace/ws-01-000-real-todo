import { beforeEach, describe, expect, it, vi } from "vitest"
import { Client, getAccessToken } from "./client"

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })

const deferred = <T>() => {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((res) => {
    resolve = res
  })

  return { promise, resolve }
}

const createClient = (onAuthExpired = vi.fn()) =>
  new Client({
    baseURL: "http://localhost:7000/api/v1",
    timeout: 1000,
    withCredentials: true,
    headers: {},
    onAuthExpired,
  })

describe("apiClient", () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    createClient().setAccessToken("")
    sessionStorage.clear()
    localStorage.clear()
  })

  it("accessToken は Web Storage に保存せずメモリだけに保持する", () => {
    const client = createClient()
    client.setAccessToken("access-token")

    expect(getAccessToken()).toBe("access-token")
    expect(sessionStorage.getItem("token")).toBeNull()
    expect(localStorage.getItem("uuid")).toBeNull()
  })

  it("同時 401 では refresh を 1 回だけ行い、元リクエストを再試行する", async () => {
    const client = createClient()
    const refresh = deferred<Response>()
    let refreshCount = 0
    let userRequestCount = 0
    const fetchMock = vi.fn(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)

        if (url.endsWith("/auth/refresh")) {
          refreshCount += 1
          return refresh.promise
        }

        if (url.endsWith("/users/me")) {
          userRequestCount += 1
          if (init?.headers instanceof Headers) {
            throw new Error("unexpected Headers instance")
          }
          const headers = init?.headers as Record<string, string> | undefined
          if (headers?.Authorization === "Bearer renewed-token") {
            return jsonResponse({ data: { uuid: "user-uuid" } })
          }

          return jsonResponse({ message: "Unauthorized" }, 401)
        }

        throw new Error(`unexpected request: ${url}`)
      },
    )
    vi.stubGlobal("fetch", fetchMock)
    client.setAccessToken("expired-token")

    const requests = [
      client.request("/users/me", { method: "GET" }),
      client.request("/users/me", { method: "GET" }),
    ]

    await Promise.resolve()
    refresh.resolve(jsonResponse({ data: { accessToken: "renewed-token" } }))

    await expect(Promise.all(requests)).resolves.toHaveLength(2)
    expect(refreshCount).toBe(1)
    expect(userRequestCount).toBe(4)
    expect(getAccessToken()).toBe("renewed-token")
  })

  it("refresh 失敗時は token を破棄して onAuthExpired を呼ぶ", async () => {
    const onAuthExpired = vi.fn()
    const client = createClient(onAuthExpired)
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)

      if (url.endsWith("/auth/refresh")) {
        return jsonResponse({ message: "Unauthorized" }, 401)
      }

      return jsonResponse({ message: "Unauthorized" }, 401)
    })
    vi.stubGlobal("fetch", fetchMock)
    client.setAccessToken("expired-token")

    await expect(
      client.request("/users/me", { method: "GET" }),
    ).rejects.toThrow("Request failed with status 401")
    expect(getAccessToken()).toBe("")
    expect(onAuthExpired).toHaveBeenCalledOnce()
  })
})
