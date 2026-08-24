import { GraphQLClient, Variables } from 'graphql-request'
import { isRestPath, resolveRestLocally } from './rest-guard'

/**
 * BaseService provides core HTTP functionality for all service classes in this connector.
 *
 * This service helps with:
 * - Performing standardized HTTP requests (GET, POST, PUT, PATCH, DELETE)
 * - Performing GraphQL queries and mutations
 * - Handling response parsing and type conversion
 * - Providing a configurable fetch implementation
 */
export class BaseService {
  private _fetch: typeof fetch
  private static SALEOR_API_URL: string

  static setCredentials(API_URL: string) {
    BaseService.SALEOR_API_URL = API_URL
  }
  /**
   * Creates a new BaseService instance
   *
   * @param {typeof fetch} [fetchFn] - Optional custom fetch implementation
   */
  constructor(fetchFn?: typeof fetch) {
    // Use provided fetch or global fetch as fallback
    this._fetch = fetchFn || fetch

    console.log("a service was created")
  }

  /**
   * Set the fetch instance to be used by this service
   *
   * @param {typeof fetch} fetchFn - The fetch implementation to use
   * @returns {BaseService} The service instance for chaining
   */
  setFetch(fetchFn: typeof fetch) {
    this._fetch = fetchFn
    return this
  }

  /**
   * Get the current fetch instance
   *
   * @returns {typeof fetch} The current fetch implementation
   */
  getFetch(): typeof fetch {
    return this._fetch
  }

  /**
   * Get a new GraphQL client instance
   *
   * @returns {GraphQLClient} A new GraphQLClient instance
   */
  getClient(): GraphQLClient {
    return new GraphQLClient(BaseService.SALEOR_API_URL, {
      fetch: this._fetch,
      requestMiddleware: (request) => {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('saleor_token') : null;
        if (token) {
          if (typeof Headers !== 'undefined' && request.headers instanceof Headers) {
            request.headers.set('authorization', `Bearer ${token}`);
          } else {
            request.headers = {
              ...request.headers as any,
              authorization: `Bearer ${token}`
            };
          }
        }
        return request;
      }
    });
  }

  private async safeFetch(url: URL | string, data?: any) {
    try {
      //@todo: remove this
      console.log("Making request to------------->", url)
      return await this._fetch(url, data)
    } catch(e: any) {
      if (navigator.onLine) {
			  throw { message: 'Please check your internet connection and try again' }
      }
      throw { message: 'Unable to reach the server. Please try again in a moment' }
    }
  }

  private async handleError(response: Response) {
    //@todo: remove this
    console.log("Response error-------------->", response)

    if (response.headers.get("Content-Type") != "application/json")
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`)

		if (response.status === 401) {
			throw { message: 'Session expired. Please login again' }
		}

    const data = await response.json()
		throw { message: 'Something went wrong. Please try again', ...data }
  }

  /**
   * Perform a GET request
   *
   * @param {string} url - The URL to request
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async get<T>(url: string): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('get', url)) as any
    const response = await this.safeFetch(url)

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a POST request
   *
   * @param {string} url - The URL to request
   * @param {any} data - The data to send in the request body
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async post<T>(url: string, data: any): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('post', url)) as any
    const response = await this.safeFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a PUT request
   *
   * @param {string} url - The URL to request
   * @param {any} data - The data to send in the request body
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async put<T>(url: string, data: any): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('put', url)) as any
    const response = await this.safeFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a PATCH request
   *
   * @param {string} url - The URL to request
   * @param {any} data - The data to send in the request body
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async patch<T>(url: string, data: any): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('patch', url)) as any
    const response = await this.safeFetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      await this.handleError(response)
    }

    return (await response.json()) as T
  }

  /**
   * Perform a DELETE request
   *
   * @param {string} url - The URL to request
   * @returns {Promise<T>} Promise resolving to the response data or status
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async delete<T>(url: string): Promise<T> {
    if (isRestPath(url)) return (await resolveRestLocally('delete', url)) as any
    const response = await this.safeFetch(url, {
      method: 'DELETE'
    })

    if (!response.ok && response.status !== 204) {
      await this.handleError(response)
    }

    if (response.status === 204) return response as T
    return (await response.json()) as T
  }
  /**
   * Perform a GraphQL query or mutation
   *
   * @param {string} document - The GraphQL query/mutation string
   * @param {Variables} [variables] - Optional variables for the query
   * @returns {Promise<T>} Promise resolving to the response data
   * @template T - The expected response data type
   * @throws {Error} Throws an error if the request fails
   */
  async query<T>(queryStr: string, variables?: Variables): Promise<T> {
    const client = this.getClient();

    try {
      return await client.request<T>(queryStr, variables)
    } catch(e: any) {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        throw { message: 'Please check your internet connection and try again' }
      }
      
      const errorStr = e.response ? JSON.stringify(e.response) : (e.message || '');
      // Saleor typically returns "Signature has expired" for expired JWT
      if (errorStr.includes('Signature has expired') || errorStr.includes('expired') || errorStr.includes('Invalid token')) {
        const refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('saleor_refresh_token') : null;
        if (refreshToken) {
          try {
            const TOKEN_REFRESH_MUTATION = `
              mutation TokenRefresh($refreshToken: String!) {
                tokenRefresh(refreshToken: $refreshToken) {
                  token
                  errors {
                    message
                  }
                }
              }
            `;
            const refreshRes = await this.getClient().request<any>(TOKEN_REFRESH_MUTATION, { refreshToken });
            const newToken = refreshRes?.tokenRefresh?.token;
            
            if (newToken) {
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('saleor_token', newToken);
              }
              if (typeof document !== 'undefined') {
                document.cookie = `connect.sid=${newToken}; path=/; max-age=86400`;
              }
              // Retry original request (middleware will grab the new token)
              return await this.getClient().request<T>(queryStr, variables);
            }
          } catch (refreshErr) {
            // refresh token is likely invalid or expired
            console.warn("Failed to refresh token:", refreshErr);
          }
        }
        
        // Refresh token failed or missing -> Local Logout
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('saleor_token');
          localStorage.removeItem('saleor_refresh_token');
        }
        if (typeof document !== 'undefined') {
          document.cookie = 'me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          document.cookie = 'connect.sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
        throw { message: 'Session Expired. Please log in again.', originalError: e };
      }
      throw e
    }
  }
}
