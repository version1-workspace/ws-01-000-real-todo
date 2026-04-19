const _sessionStorage =
  typeof sessionStorage !== "undefined" ? sessionStorage : undefined;

export const getAccessToken = () => _sessionStorage?.getItem("token") || "";

export const setUserId = (uuid: string) => localStorage.setItem("uuid", uuid);
export const getUserId = () => localStorage.getItem("uuid") || "";

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiErrorResponse<T = unknown> extends Error {
  response?: ApiResponse<T>;
}

interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

class Client {
  baseURL: string;
  timeout: number;
  withCredentials?: boolean;
  headers: Record<string, string>;
  handleError?: (error: ApiErrorResponse) => ApiErrorResponse | undefined;

  constructor(config: {
    baseURL: string;
    timeout: number;
    withCredentials?: boolean;
    handleError?: (error: ApiErrorResponse) => ApiErrorResponse | undefined;
    headers: {
      Authorization?: string;
    };
  }) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.withCredentials = config.withCredentials;
    const token = getAccessToken();
    this.headers = {
      ...(config.headers || {}),
    };
    if (token) {
      this.headers = {
        ...(config.headers || {}),
        Authorization: token ? `Bearer ${token}` : "",
      };
    }

    if (config.handleError) {
      this.handleError = config.handleError;
    } else {
      this.handleError = (error: ApiErrorResponse): ApiErrorResponse => {
        console.log("API Error:", error);
        if (error.response) {
          console.log("Status:", error.response.status);
          console.log("Data:", error.response.data);
        }
        return error;
      };
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
    };
  }

  setAccessToken = (token: string) => {
    if (token) {
      _sessionStorage?.setItem("token", token);
      this.headers.Authorization = `Bearer ${token}`;
    } else {
      delete this.headers.Authorization;
    }
  };

  private buildUrl(url: string, params?: Record<string, unknown>) {
    const normalizedUrl = url.startsWith("/") ? url.slice(1) : url;
    const normalizedBaseUrl = this.baseURL.endsWith("/")
      ? this.baseURL
      : `${this.baseURL}/`;
    const requestUrl = new URL(normalizedUrl, normalizedBaseUrl);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }

        if (Array.isArray(value)) {
          value.forEach((item) =>
            requestUrl.searchParams.append(key, String(item)),
          );
          return;
        }

        requestUrl.searchParams.set(key, String(value));
      });
    }

    return requestUrl.toString();
  }

  async request<T>(
    url: string,
    options: RequestConfig & {
      method: string;
      body?: unknown;
    },
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.buildUrl(url, options.params), {
        method: options.method,
        credentials: this.withCredentials ? "include" : "same-origin",
        headers: {
          ...this.headers,
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...(options.headers || {}),
        },
        body:
          options.body === undefined
            ? undefined
            : typeof options.body === "string"
              ? options.body
              : JSON.stringify(options.body),
        signal: controller.signal,
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");
      const data = isJson
        ? ((await response.json()) as T)
        : (undefined as unknown as T);

      const result: ApiResponse<T> = {
        data,
        status: response.status,
        headers: response.headers,
      };

      if (!response.ok) {
        const error = new Error(
          `Request failed with status ${response.status}`,
        ) as ApiErrorResponse<T>;
        error.response = result;
        const handledError = this.handleError?.(error);
        if (handledError) {
          throw handledError;
        }
      }

      return result;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:7000";

export const apiClient = new Client({
  baseURL: `${baseURL}/api/v1`,
  timeout: 1000,
  withCredentials: true,
  headers: { Authorization: getAccessToken() },
});
