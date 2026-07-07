import type { ConnectorConfig } from '../config'

export class NotSupportedError extends Error {
  code = 'NOT_SUPPORTED' as const
  constructor(feature: string) {
    super(`${feature} is not supported by the Saleor connector`)
    this.name = 'NotSupportedError'
  }
}

export class BaseService {
  protected config: ConnectorConfig
  private _fetch: typeof fetch

  constructor(config: ConnectorConfig) {
    this.config = config
    this._fetch = config.fetchFn || fetch
  }

  protected unsupported(feature: string): never { throw new NotSupportedError(feature) }
  protected authHeaders(): Record<string, string> {
    return this.config.accessToken ? { Authorization: `Bearer ${this.config.accessToken}` } : {}
  }

  // REST-style helpers are not applicable to a GraphQL API; present only so the
  // shared service surface type-checks. They resolve to NotSupported at runtime.
  protected listAt(_path: string, _opts: { page?: number; perPage?: number; search?: string } = {}): Promise<unknown> { return this.unsupported('rest.listAt') }
  get<T = unknown>(_path: string): Promise<T> { return this.unsupported('rest.get') }
  post<T = unknown>(_path: string, _data?: unknown): Promise<T> { return this.unsupported('rest.post') }
  put<T = unknown>(_path: string, _data?: unknown): Promise<T> { return this.unsupported('rest.put') }
  patch<T = unknown>(_path: string, _data?: unknown): Promise<T> { return this.unsupported('rest.patch') }
  delete<T = unknown>(_path: string): Promise<T> { return this.unsupported('rest.delete') }

  async graphql<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    let response: Response
    try {
      response = await this._fetch(this.config.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...this.authHeaders() },
        body: JSON.stringify({ query, variables }),
      })
    } catch {
      throw { message: 'Unable to reach the Saleor GraphQL endpoint.' }
    }
    if (!response.ok) throw { message: `Saleor GraphQL HTTP error ${response.status}`, status: response.status }
    const json = (await response.json()) as { data?: T; errors?: Array<{ message: string }> }
    if (json.errors?.length) throw { message: json.errors.map((e) => e.message).join('; '), errors: json.errors }
    return json.data as T
  }
}
