import type { User } from '../types'
import { BaseService } from './base.service'

type SaleorUser = { id?: string; email?: string; firstName?: string; lastName?: string; avatar?: { url?: string } | null } | null

/** Map a Saleor user into a litekart `User`. */
function mapUser(u: SaleorUser, storeId?: string): User {
  const now = new Date().toISOString()
  return {
    id: u?.id || '',
    email: u?.email || '',
    phone: null,
    firstName: u?.firstName ?? null,
    lastName: u?.lastName ?? null,
    avatar: u?.avatar?.url ?? null,
    role: 'USER',
    status: 'active',
    cartId: null,
    isApproved: true,
    isDeleted: false,
    isEmailVerified: true,
    isPhoneVerified: false,
    signInCount: 1,
    otpAttempt: 0,
    userAuthToken: null,
    createdAt: now,
    updatedAt: now,
    ...(storeId ? {} : {})
  }
}

/**
 * AuthService — Saleor authentication + litekart `me` cookie state.
 *
 * Two concerns kept separate (per spec):
 *  1. Vendor auth: Saleor `tokenCreate` → access/refresh tokens (stored in creds).
 *  2. kitcommerce-core auth state: `connect.sid` + `me` cookies via document.cookie.
 */
export class AuthService extends BaseService {
  private static instance: AuthService
  static getInstance(): AuthService {
    if (!AuthService.instance) AuthService.instance = new AuthService()
    return AuthService.instance
  }

  /** Write the kitcommerce-core auth cookies. `role: 'USER'` is mandatory. */
  private setAuthCookies(user: User): void {
    // connect.sid can be any non-empty string.
    this.setCookie('connect.sid', `s:${user.id || 'session'}.${Date.now()}`)
    const me = {
      userId: user.id || null,
      phone: user.phone ?? null,
      email: user.email || null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      avatar: user.avatar ?? null,
      role: 'USER',
      storeId: this.creds.storeId || null
    }
    this.setCookie('me', JSON.stringify(me))
  }

  /** Authenticate against Saleor, stash tokens, set auth cookies. */
  async login({ email, password }: { email: string; password: string; cartId?: string | null }): Promise<User> {
    const query = `mutation Login($email: String!, $password: String!) {
      tokenCreate(email: $email, password: $password) {
        token refreshToken
        user { id email firstName lastName avatar { url } }
        errors { field message code }
      }
    }`
    const data = await this.graphql<{ tokenCreate: any }>(query, { email, password })
    const payload = data.tokenCreate
    if (payload?.errors?.length) {
      throw { message: payload.errors.map((e: any) => e.message).filter(Boolean).join('; ') || 'Invalid credentials' }
    }
    BaseService.setCredentials({ accessToken: payload.token, refreshToken: payload.refreshToken })
    this.setCookie('saleor_token', payload.token)
    this.setCookie('saleor_refresh', payload.refreshToken)
    const user = mapUser(payload.user, this.creds.storeId)
    this.setAuthCookies(user)
    return user
  }

  /** Current authenticated user (Saleor `me`). */
  async getMe(): Promise<User> {
    const query = 'query Me { me { id email firstName lastName avatar { url } } }'
    const data = await this.graphql<{ me: SaleorUser }>(query)
    return mapUser(data.me, this.creds.storeId)
  }

  async getUser(id: string): Promise<User> {
    return this.getMe().then((u) => ({ ...u, id }))
  }

  /** Register a new Saleor account, then behave like login. */
  async signup({
    firstName,
    lastName,
    email,
    password
  }: {
    firstName: string
    lastName: string
    phone?: string
    email: string
    password: string
    passwordConfirmation?: string
    cartId?: string | null
  }): Promise<User> {
    const query = `mutation Register($email: String!, $password: String!, $channel: String) {
      accountRegister(input: { email: $email, password: $password, channel: $channel }) {
        user { id email firstName lastName } errors { field message code }
      }
    }`
    const data = await this.graphql<{ accountRegister: any }>(query, {
      email,
      password,
      channel: this.creds.channelId || 'default-channel'
    })
    if (data.accountRegister?.errors?.length) {
      throw { message: data.accountRegister.errors.map((e: any) => e.message).filter(Boolean).join('; ') || 'Signup failed' }
    }
    // Some Saleor configs require email confirmation; try to log in regardless.
    try {
      return await this.login({ email, password })
    } catch {
      return mapUser({ ...data.accountRegister.user, firstName, lastName }, this.creds.storeId)
    }
  }

  /** Clear tokens + auth cookies. */
  async logout() {
    BaseService.setCredentials({ accessToken: undefined, refreshToken: undefined })
    this.setCookie('connect.sid', '', -1)
    this.setCookie('me', '', -1)
    this.setCookie('saleor_token', '', -1)
    this.setCookie('saleor_refresh', '', -1)
    return this.dummy({ success: true })
  }

  // ---- present-but-dummy (no direct Saleor equivalent) ----
  async verifyEmail(_email: string, _token: string) { return this.dummy({ success: true }) }
  async forgotPassword(_a: { email: string; referrer: string }) { return this.dummy({ success: true }) }
  async changePassword(_b: { old: string; password: string }) { return this.dummy({ success: true }) }
  async resetPassword(_a: { userId: string; token: string; password: string }) { return this.dummy({ success: true }) }
  async getOtp(_a: { phone: string }) { return this.dummy({ success: true }) }
  async verifyOtp(_a: { phone: string; otp: string }) { return this.dummy({ success: true }) }
  async joinAsVendor(_a: Record<string, unknown>) { return this.dummy({ success: true }) }
  async joinAsAdmin(_a: Record<string, unknown>) { return this.dummy({ success: true }) }
  async updateProfile(args: { id: string; firstName?: string; lastName?: string; email?: string; phone?: string; avatar?: string }) {
    const query = `mutation UpdateMe($input: AccountInput!) {
      accountUpdate(input: $input) { user { id email firstName lastName avatar { url } } errors { message } }
    }`
    try {
      const data = await this.graphql<{ accountUpdate: any }>(query, {
        input: { firstName: args.firstName, lastName: args.lastName }
      })
      return mapUser(data.accountUpdate?.user, this.creds.storeId)
    } catch {
      return this.dummy(mapUser({ id: args.id, email: args.email, firstName: args.firstName, lastName: args.lastName }, this.creds.storeId))
    }
  }
}

export const authService = AuthService.getInstance()
