import type { AuthTokenResponse } from "./generated/model/authTokenResponse"

export interface ApiResponse<T> {
  data: T
  status: number
  headers: Headers
}

export interface ApiErrorResponse<T = unknown> extends Error {
  response?: ApiResponse<T>
}

interface RequestConfig {
  params?: Record<string, unknown>
  headers?: Record<string, string>
}

type RequestOptions = RequestConfig & {
  method: string
  body?: unknown
}

type InternalRequestConfig = {
  skipAuthRefresh?: boolean
}

interface ClientConfig {
  baseURL: string
  timeout: number
  withCredentials?: boolean
  handleError?: (error: ApiErrorResponse) => ApiErrorResponse | undefined
  onAuthExpired?: () => void
  headers?: Record<string, string>
}

const defaultAuthExpiredHandler = () => {
  if (typeof window === "undefined") {
    return
  }

  if (window.location.pathname.startsWith("/auth/login")) {
    return
  }

  window.location.href = "/auth/login?error=loginRequired"
}

export class Client {
  baseURL: string
  timeout: number
  withCredentials?: boolean
  headers: Record<string, string>
  handleError?: (error: ApiErrorResponse) => ApiErrorResponse | undefined
  onAuthExpired: () => void
  private refreshRequest?: Promise<string>
  private accessToken = ""

  constructor(config: ClientConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.withCredentials = config.withCredentials
    this.onAuthExpired = config.onAuthExpired ?? defaultAuthExpiredHandler
    this.headers = config.headers ?? {}

    if (config.handleError) {
      this.handleError = config.handleError
    } else {
      this.handleError = (error: ApiErrorResponse): ApiErrorResponse => {
        console.log("API Error:", error)
        if (error.response) {
          console.log("Status:", error.response.status)
          console.log("Data:", error.response.data)
        }
        return error
      }
    }
  }

  get instance() {
    return {
      get: <T = any>(url: string, config?: RequestConfig) =>
        this.request<T>(url, { method: "GET", ...config }),
      post: <T = any>(url: string, data?: unknown, config?: RequestConfig) =>
        this.request<T>(url, { method: "POST", body: data, ...config }),
      patch: <T = any>(url: string, data?: unknown, config?: RequestConfig) =>
        this.request<T>(url, { method: "PATCH", body: data, ...config }),
      put: <T = any>(url: string, data?: unknown, config?: RequestConfig) =>
        this.request<T>(url, { method: "PUT", body: data, ...config }),
      delete: <T = any>(url: string, config?: RequestConfig) =>
        this.request<T>(url, { method: "DELETE", ...config }),
    }
  }

  setAccessToken = (token: string) => {
    this.accessToken = token
  }

  getAccessToken = () => this.accessToken

  private buildUrl(url: string, params?: Record<string, unknown>) {
    const normalizedUrl = url.startsWith("/") ? url.slice(1) : url
    const normalizedBaseUrl = this.baseURL.endsWith("/")
      ? this.baseURL
      : `${this.baseURL}/`
    const requestUrl = new URL(normalizedUrl, normalizedBaseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return
        }

        if (Array.isArray(value)) {
          value.forEach((item) =>
            requestUrl.searchParams.append(key, String(item)),
          )
          return
        }

        requestUrl.searchParams.set(key, String(value))
      })
    }

    return requestUrl.toString()
  }

  private isRefreshableRequest(url: string) {
    return !url.startsWith("/auth/login") && !url.startsWith("/auth/refresh")
  }

  private async refreshAccessToken() {
    if (!this.refreshRequest) {
      this.refreshRequest = this.request<AuthTokenResponse>(
        "/auth/refresh",
        {
          method: "POST",
        },
        { skipAuthRefresh: true },
      )
        .then((response) => {
          const token = response.data.data.accessToken
          this.setAccessToken(token)
          return token
        })
        .finally(() => {
          this.refreshRequest = undefined
        })
    }

    return this.refreshRequest
  }

  private shouldRefreshAccessToken(
    response: Response,
    url: string,
    internal: InternalRequestConfig,
  ) {
    return (
      response.status === 401 &&
      !internal.skipAuthRefresh &&
      this.isRefreshableRequest(url)
    )
  }

  private buildHeaders(options: RequestOptions) {
    return {
      ...this.headers,
      ...(this.accessToken
        ? { Authorization: `Bearer ${this.accessToken}` }
        : {}),
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    }
  }

  private buildBody(body: unknown) {
    if (body === undefined) {
      return undefined
    }

    return typeof body === "string" ? body : JSON.stringify(body)
  }

  private async retryAfterRefresh<T>(url: string, options: RequestOptions) {
    try {
      await this.refreshAccessToken()
      return this.request<T>(url, options, { skipAuthRefresh: true })
    } catch (_error) {
      this.setAccessToken("")
      this.onAuthExpired()
    }
  }

  private createError<T>(result: ApiResponse<T>) {
    const error = new Error(
      `Request failed with status ${result.status}`,
    ) as ApiErrorResponse<T>
    error.response = result
    return error
  }

  async request<T>(
    url: string,
    options: RequestOptions,
    internal: InternalRequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(this.buildUrl(url, options.params), {
        method: options.method,
        credentials: this.withCredentials ? "include" : "same-origin",
        headers: this.buildHeaders(options),
        body: this.buildBody(options.body),
        signal: controller.signal,
      })

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json")
      const data = isJson
        ? ((await response.json()) as T)
        : (undefined as unknown as T)

      const result: ApiResponse<T> = {
        data,
        status: response.status,
        headers: response.headers,
      }

      if (!response.ok) {
        if (this.shouldRefreshAccessToken(response, url, internal)) {
          const retryResult = await this.retryAfterRefresh<T>(url, options)
          if (retryResult) {
            return retryResult
          }
        }

        const handledError = this.handleError?.(this.createError(result))
        if (handledError) {
          throw handledError
        }
      }

      return result
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000"

export const apiClient = new Client({
  baseURL: `${baseURL}/api/v1`,
  timeout: 1000,
  withCredentials: true,
  headers: {},
})

export const getAccessToken = () => apiClient.getAccessToken()
