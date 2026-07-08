import type { User } from '../types'
import { AuthService } from './auth-service'
import { BaseService } from './base.service'

/**
 * UserService — Saleor connector. Auth-flow methods delegate to AuthService so
 * the `me`/`connect.sid` cookie behaviour + token handling stay in one place.
 * Signatures mirror @misiki/litekart-connector's UserService.
 */
export class UserService extends BaseService {
  private static instance: UserService
  static getInstance(): UserService {
    if (!UserService.instance) UserService.instance = new UserService()
    return UserService.instance
  }

  private get auth() {
    return AuthService.getInstance()
  }

  async getMe(): Promise<User> {
    return this.auth.getMe()
  }
  async getUser(id: string): Promise<User> {
    return this.auth.getUser(id)
  }
  async login(args: { email: string; password: string; cartId?: string | null }): Promise<User> {
    return this.auth.login(args)
  }
  async signup(args: { firstName: string; lastName: string; phone?: string; email: string; password: string; passwordConfirmation?: string; cartId?: string | null }): Promise<User> {
    return this.auth.signup(args)
  }
  async logout() {
    return this.auth.logout()
  }
  async updateProfile(args: { id: string; firstName?: string; lastName?: string; email?: string; phone?: string; avatar?: string }) {
    return this.auth.updateProfile(args)
  }
  async forgotPassword(args: { email: string; referrer: string }) {
    return this.auth.forgotPassword(args)
  }
  async changePassword(args: { old: string; password: string }) {
    return this.auth.changePassword(args)
  }
  async resetPassword(args: { userId: string; token: string; password: string }) {
    return this.auth.resetPassword(args)
  }
  async getOtp(args: { phone: string }) {
    return this.auth.getOtp(args)
  }
  async verifyOtp(args: { phone: string; otp: string }) {
    return this.auth.verifyOtp(args)
  }
  async joinAsVendor(args: Record<string, unknown>) {
    return this.auth.joinAsVendor(args)
  }
  async checkEmail(_email: string) {
    return this.dummy({ exists: false })
  }
  async deleteUser(_id: string) {
    return this.dummy({ success: true })
  }
}

export const userService = UserService.getInstance()
