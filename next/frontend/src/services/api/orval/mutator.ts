import type { ApiErrorResponse } from "../client"
import { apiClient } from "../client"

export var FETCH_INSTANCE = apiClient.instance

export function customInstance<T>(url: string, options?: RequestInit) {
  return apiClient
    .request(url, {
      method: options?.method || "GET",
      headers: options?.headers as Record<string, string> | undefined,
      body: options?.body,
    })
    .then((response) => {
      return {
        data: response.data,
        status: response.status,
        headers: response.headers,
      } as T
    })
}

export type ErrorType<Error> = ApiErrorResponse<Error>
export type BodyType<BodyData> = BodyData
