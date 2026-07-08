/**
 * Credentials for the Saleor connector.
 *
 * Per kitcommerce-core's usage, credentials are NOT passed via service
 * constructors (the client imports prebuilt singletons). They are injected once
 * through `BaseService.setCredentials(...)` from the SvelteKit client + server
 * hooks. At least one identifying credential (apiUrl / storeId / channelId) is
 * always used by any vendor.
 */
export interface Credentials {
  /** Saleor GraphQL endpoint, e.g. https://store/graphql/ */
  apiUrl: string
  /** Saleor channel slug used for channel-scoped queries. */
  channelId?: string
  /** Litekart store id (passed through into the `me` cookie / responses). */
  storeId?: string
  /** Saleor user access token (short-lived, ~5 min). */
  accessToken?: string
  /** Saleor refresh token used to silently re-issue an access token. */
  refreshToken?: string
}
