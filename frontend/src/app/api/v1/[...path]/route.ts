import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const API_BASE_PATH = "/api/v1"
const UPSTREAM_TIMEOUT_MS = 10_000
const UNSAFE_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"])
const REQUEST_HEADERS = ["accept", "authorization", "content-type"]
const RESPONSE_HEADERS = [
  "cache-control",
  "content-disposition",
  "content-type",
  "etag",
  "last-modified",
]

type RouteContext = {
  params: Promise<{ path: string[] }>
}

function upstreamBaseUrl(): URL | undefined {
  const value = process.env.API_BASE_URL
  if (!value) return undefined

  try {
    const url = new URL(value)
    const path = url.pathname.replace(/\/$/, "")
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      path !== API_BASE_PATH
    ) {
      return undefined
    }
    url.pathname = path
    return url
  } catch {
    return undefined
  }
}

function refreshTokenCookie(cookieHeader: string | null): string | undefined {
  if (!cookieHeader) return undefined
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("refreshToken="))
  return cookie
}

function hasValidRequestOrigin(request: Request): boolean {
  if (!UNSAFE_METHODS.has(request.method)) return true
  const requestUrl = new URL(request.url)
  const origin = request.headers.get("origin")
  const fetchSite = request.headers.get("sec-fetch-site")
  return (
    (!origin || origin === requestUrl.origin) &&
    (!fetchSite || fetchSite === "same-origin" || fetchSite === "none")
  )
}

function requestHeaders(request: Request): Headers {
  const headers = new Headers()
  for (const name of REQUEST_HEADERS) {
    const value = request.headers.get(name)
    if (value) headers.set(name, value)
  }

  const refreshToken = refreshTokenCookie(request.headers.get("cookie"))
  if (refreshToken) headers.set("cookie", refreshToken)
  return headers
}

function responseHeaders(upstream: Response): Headers {
  const headers = new Headers({ "Cache-Control": "no-store" })
  for (const name of RESPONSE_HEADERS) {
    if (name === "cache-control") continue
    const value = upstream.headers.get(name)
    if (value) headers.set(name, value)
  }

  const cookies = upstream.headers.getSetCookie?.() ?? []
  for (const cookie of cookies) headers.append("Set-Cookie", cookie)
  return headers
}

function errorResponse(status: number, message: string): NextResponse {
  return NextResponse.json(
    { message },
    { status, headers: { "Cache-Control": "no-store" } },
  )
}

async function proxy(request: Request, context: RouteContext): Promise<Response> {
  if (!hasValidRequestOrigin(request)) {
    return errorResponse(403, "Invalid request origin")
  }

  const baseUrl = upstreamBaseUrl()
  if (!baseUrl) {
    return errorResponse(500, "API proxy is not configured")
  }

  const { path } = await context.params
  if (path.some((segment) => segment === "." || segment === "..")) {
    return errorResponse(400, "Invalid API path")
  }
  const target = new URL(baseUrl)
  target.pathname = `${API_BASE_PATH}/${path.map(encodeURIComponent).join("/")}`
  target.search = new URL(request.url).search

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)
  try {
    const init: RequestInit & { duplex?: "half" } = {
      method: request.method,
      headers: requestHeaders(request),
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : request.body,
      duplex: request.method === "GET" || request.method === "HEAD" ? undefined : "half",
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
    }
    const upstream = await fetch(target, init)
    const responseBody =
      request.method === "HEAD" ||
      upstream.status === 204 ||
      upstream.status === 304
        ? null
        : await upstream.arrayBuffer()
    return new Response(responseBody, {
      status: upstream.status,
      headers: responseHeaders(upstream),
    })
  } catch (error) {
    const isAbortError =
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      error.name === "AbortError"
    return isAbortError
      ? errorResponse(504, "API request timed out")
      : errorResponse(502, "API request failed")
  } finally {
    clearTimeout(timeout)
  }
}

export const GET = proxy
export const POST = proxy
export const PATCH = proxy
export const PUT = proxy
export const DELETE = proxy
export const HEAD = proxy
export const OPTIONS = proxy
