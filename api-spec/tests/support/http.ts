const rawBaseUrl = process.env.API_BASE_URL;

if (!rawBaseUrl) {
  throw new Error('API_BASE_URL is required for api-spec E2E tests');
}

export const apiBaseUrl = rawBaseUrl.replace(/\/$/, '');

export const request = async (params: {
  path: string;
  method?: string;
  token?: string;
  cookie?: string;
  body?: unknown;
}) => {
  const response = await fetch(`${apiBaseUrl}${params.path}`, {
    method: params.method ?? 'GET',
    headers: {
      ...(params.token ? { Authorization: `Bearer ${params.token}` } : {}),
      ...(params.cookie ? { Cookie: params.cookie } : {}),
      ...(params.body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: params.body ? JSON.stringify(params.body) : undefined,
  });

  const text = await response.text();
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const json = text && isJson ? JSON.parse(text) : undefined;

  return {
    status: response.status,
    headers: response.headers,
    text,
    json,
  };
};
