import type { Credentials } from '../config'

/**
 * BaseService — shared Saleor GraphQL client for every service.
 *
 * Design (to match how kitcommerce-core consumes @misiki/litekart-connector):
 *  - Credentials are injected via the static `setCredentials` (called from the
 *    SvelteKit client + server hooks) — NOT through constructors, because the
 *    client imports prebuilt singleton services.
 *  - Server-side, a fresh service instance is created with a custom `fetch`
 *    (carrying request cookies); client-side the prebuilt singleton uses global fetch.
 *  - Unsuccessful responses THROW their body (always carrying a `message`) rather
 *    than returning it, so kitcommerce-core can surface `message` to the user.
 *  - Saleor access tokens are short-lived (~5 min); on `ExpiredSignatureError`
 *    we silently refresh via `refreshToken` and retry once, under the hood.
 */
export class BaseService {
  private static _credentials: Credentials = { apiUrl: '' }
  protected _fetch: typeof fetch

  constructor(fetchFn?: typeof fetch) {
    this._fetch = fetchFn || (globalThis.fetch as typeof fetch)
  }

  /** Inject/merge credentials once (api url, channel, store, tokens). */
  static setCredentials(creds: Partial<Credentials>): void {
    BaseService._credentials = { ...BaseService._credentials, ...creds }
  }

  static getCredentials(): Credentials {
    return BaseService._credentials
  }

  protected get creds(): Credentials {
    return BaseService._credentials
  }

  /** Run a GraphQL operation with error-throwing + silent token refresh. */
  protected async graphql<T = any>(
    query: string,
    variables: Record<string, any> = {},
    _retried = false
  ): Promise<T> {
    const { apiUrl, accessToken } = this.creds
    let response: Response
    try {
      response = await this._fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ query, variables })
      })
    } catch {
      throw { message: 'Unable to reach the server. Please check your connection and try again.' }
    }

    if (!response.ok) {
      throw this.toError(await this.safeJson(response), `Request failed with status ${response.status}`)
    }

    const json = (await this.safeJson(response)) as { data?: T; errors?: any[] }

    if (json.errors?.length) {
      if (!_retried && this.creds.refreshToken && this.isTokenExpired(json.errors)) {
        if (await this.refreshAccessToken()) return this.graphql<T>(query, variables, true)
      }
      throw this.toError(json, json.errors.map((e) => e?.message).filter(Boolean).join('; ') || 'GraphQL error')
    }

    return json.data as T
  }

  /** Detect Saleor's ExpiredSignatureError across error shapes. */
  private isTokenExpired(errors: any[]): boolean {
    return errors.some((e) => {
      const code = e?.extensions?.exception?.code || e?.extensions?.code || ''
      return code === 'ExpiredSignatureError' || /signature has expired|token.*expired/i.test(e?.message || '')
    })
  }

  /** Saleor tokenRefresh -> stash a fresh access token into credentials. */
  protected async refreshAccessToken(): Promise<boolean> {
    const { apiUrl, refreshToken } = this.creds
    if (!refreshToken) return false
    const query =
      'mutation Refresh($refreshToken: String!) { tokenRefresh(refreshToken: $refreshToken) { token errors { message } } }'
    try {
      const res = await this._fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: { refreshToken } })
      })
      const token = (await res.json())?.data?.tokenRefresh?.token
      if (token) {
        BaseService.setCredentials({ accessToken: token })
        this.setCookie('saleor_token', token)
        return true
      }
    } catch {
      /* fall through to false */
    }
    return false
  }

  private async safeJson(res: Response): Promise<any> {
    try {
      return await res.json()
    } catch {
      return {}
    }
  }

  /** Normalise any body into an object guaranteed to have a `message`. */
  protected toError(body: any, fallback: string): { message: string; [k: string]: any } {
    if (body && typeof body === 'object') {
      const message =
        body.message ||
        (Array.isArray(body.errors) ? body.errors.map((e: any) => e?.message).filter(Boolean).join('; ') : '') ||
        fallback
      return { ...body, message }
    }
    return { message: typeof body === 'string' && body ? body : fallback }
  }

  /**
   * Fallback for unsupported methods — returns dummy data so consumers never hit
   * `undefined is not a function`. Never throws.
   */
  protected dummy<T>(value: T): Promise<T> {
    return Promise.resolve(value)
  }

  protected emptyPage<T = any>() {
    return this.dummy<{ data: T[]; count: number; pageSize: number; noOfPage: number; page: number }>({
      data: [],
      count: 0,
      pageSize: 0,
      noOfPage: 0,
      page: 1
    })
  }

  /** Write a browser cookie (client-side auth state); no-op on the server. */
  protected setCookie(name: string, value: string, days = 30): void {
    if (typeof document === 'undefined') return
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
  }
}
