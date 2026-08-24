import type { User, verifyEmail } from '../types'
import { BaseService } from './base.service'

const ME_QUERY = `
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      isActive
      dateJoined
      avatar {
        url
      }
    }
  }
`

const USER_QUERY = `
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      isActive
      dateJoined
      avatar {
        url
      }
    }
  }
`

const TOKEN_CREATE_MUTATION = `
  mutation TokenCreate($email: String!, $password: String!) {
    tokenCreate(email: $email, password: $password) {
      token
      refreshToken
      user {
        id
        email
        firstName
        lastName
        isActive
        dateJoined
        avatar {
          url
        }
      }
      errors {
        field
        message
      }
    }
  }
`

const TOKENS_DEACTIVATE_ALL_MUTATION = `
  mutation TokensDeactivateAll {
    tokensDeactivateAll {
      errors {
        field
        message
      }
    }
  }
`

const ACCOUNT_REGISTER_MUTATION = `
  mutation AccountRegister($input: AccountRegisterInput!) {
    accountRegister(input: $input) {
      user {
        id
        email
        firstName
        lastName
        isActive
        dateJoined
        avatar {
          url
        }
      }
      errors {
        field
        message
      }
    }
  }
`

const REQUEST_PASSWORD_RESET_MUTATION = `
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl, channel: "default-channel") {
      errors {
        field
        message
      }
    }
  }
`

const SET_PASSWORD_MUTATION = `
  mutation SetPassword($email: String!, $token: String!, $password: String!) {
    setPassword(email: $email, token: $token, password: $password) {
      token
      errors {
        field
        message
      }
    }
  }
`

const PASSWORD_CHANGE_MUTATION = `
  mutation PasswordChange($oldPassword: String!, $newPassword: String!) {
    passwordChange(oldPassword: $oldPassword, newPassword: $newPassword) {
      user {
        id
        email
        firstName
        lastName
        isActive
        dateJoined
      }
      errors {
        field
        message
      }
    }
  }
`

const ACCOUNT_UPDATE_MUTATION = `
  mutation AccountUpdate($input: AccountInput!) {
    accountUpdate(input: $input) {
      user {
        id
        email
        firstName
        lastName
        isActive
        dateJoined
      }
      errors {
        field
        message
      }
    }
  }
`

function mapSaleorUser(node: any, token?: string): User {
  return {
    id: node.id,
    email: node.email,
    firstName: node.firstName,
    lastName: node.lastName,
    avatar: node.avatar?.url || null,
    isApproved: node.isActive ?? true,
    isDeleted: false,
    isEmailVerified: true,
    isPhoneVerified: false,
    otpAttempt: 0,
    signInCount: 0,
    createdAt: node.dateJoined || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userAuthToken: token || null
  };
}

function handleErrors(errors?: any[]) {
  if (errors && errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(', '));
  }
}

/**
 * AuthService provides functionality for user authentication and profile management.
 *
 * This service helps with:
 * - User registration and login processes
 * - Password management and recovery
 * - User profile management
 * - Authentication verification
 * - Vendor and admin registration
 */
export class AuthService extends BaseService {
  private static instance: AuthService

  /**
   * Get the singleton instance
   *
   * @returns {AuthService} The singleton instance of AuthService
   */
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  /**
   * Retrieves the current authenticated user's profile
   */
  async getMe() {
    const res = await this.query<any>(ME_QUERY);
    if (!res?.me) throw new Error("Not authenticated");
    return mapSaleorUser(res.me);
  }

  /**
   * Fetches a user by ID
   */
  async getUser(id: string): Promise<User> {
    const res = await this.query<any>(USER_QUERY, { id });
    if (!res?.user) throw new Error("User not found");
    return mapSaleorUser(res.user) as User;
  }

  /**
   * Verifies a user's email with the provided token
   */
  async verifyEmail(email: string, token: string) {
    throw new Error("verifyEmail is not natively supported in this Saleor connector setup.");
    return {} as verifyEmail;
  }

  /**
   * Registers a new user account
   */
  async signup({
    firstName,
    lastName,
    phone,
    email,
    password,
    passwordConfirmation,
    cartId = null
  }: {
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    passwordConfirmation: string
    cartId?: string | null
  }) {
    if (password !== passwordConfirmation) {
      throw new Error("Passwords do not match");
    }
    
    const res = await this.query<any>(ACCOUNT_REGISTER_MUTATION, {
      input: {
        firstName,
        lastName,
        email,
        password,
        channel: "default-channel"
      }
    });

    handleErrors(res?.accountRegister?.errors);
    return mapSaleorUser(res.accountRegister.user);
  }

  /**
   * Registers a new vendor account
   */
  async joinAsVendor(data: any) {
    throw new Error("joinAsVendor is not natively supported in Saleor without a custom App.");
    return {} as User;
  }

  /**
   * Registers a new admin account
   */
  async joinAsAdmin(data: any) {
    throw new Error("joinAsAdmin is not natively supported in Saleor for public storefronts.");
    return {} as User;
  }

  /**
   * Authenticates a user with email and password
   */
  async login({
    email,
    password,
    cartId = null
  }: {
    email: string
    password: string
    cartId?: string | null
  }) {
    const res = await this.query<any>(TOKEN_CREATE_MUTATION, {
      email,
      password
    });

    handleErrors(res?.tokenCreate?.errors);
    const { token, refreshToken, user } = res.tokenCreate;
    
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('saleor_token', token);
      if (refreshToken) {
        localStorage.setItem('saleor_refresh_token', refreshToken);
      }
    }

    const meCookie = {
      userId: user.id,
      phone: null,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar?.url || null,
      role: "USER",
      storeId: "store_01KSM2F784VTYVGF5FKKVHPBNH"
    };

    if (typeof document !== 'undefined') {
      document.cookie = `me=${encodeURIComponent(JSON.stringify(meCookie))}; path=/; max-age=86400`;
      document.cookie = `connect.sid=${token}; path=/; max-age=86400`;
    }
    
    return meCookie;
  }

  /**
   * Initiates the password recovery process
   */
  async forgotPassword({
    email,
    referrer
  }: {
    email: string
    referrer: string
  }) {
    const res = await this.query<any>(REQUEST_PASSWORD_RESET_MUTATION, {
      email,
      redirectUrl: referrer
    });

    handleErrors(res?.requestPasswordReset?.errors);
    return { email } as unknown as User;
  }

  /**
   * Changes the password for the current authenticated user
   */
  async changePassword(body: { old: string; password: string }) {
    const res = await this.query<any>(PASSWORD_CHANGE_MUTATION, {
      oldPassword: body.old,
      newPassword: body.password
    });

    handleErrors(res?.passwordChange?.errors);
    return mapSaleorUser(res.passwordChange.user);
  }

  /**
   * Resets a user's password using a recovery token
   */
  async resetPassword({
    userId,
    token,
    password
  }: {
    userId: string
    token: string
    password: string
  }) {
    const res = await this.query<any>(SET_PASSWORD_MUTATION, {
      email: userId, 
      token,
      password
    });

    handleErrors(res?.setPassword?.errors);
    return { id: userId } as unknown as User;
  }

  /**
   * Requests an OTP (One-Time Password) for phone verification
   */
  async getOtp({ phone }: { phone: string }) {
    throw new Error("OTP functionality is not supported in Saleor natively.");
    return {} as User;
  }

  /**
   * Verifies a phone number using an OTP
   */
  async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
    throw new Error("OTP verification is not supported in Saleor natively.");
    return {} as User;
  }

  /**
   * Logs out the current user
   */
  async logout() {
    try {
      const res = await this.query<any>(TOKENS_DEACTIVATE_ALL_MUTATION);
      handleErrors(res?.tokensDeactivateAll?.errors);
    } catch (e) {
      console.warn("Error deactivating tokens on server:", e);
    }
    
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('saleor_token');
      localStorage.removeItem('saleor_refresh_token');
    }

    if (typeof document !== 'undefined') {
      document.cookie = 'me=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'connect.sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    
    return { success: true };
  }

  /**
   * Updates a user's profile information
   */
  async updateProfile({
    id,
    firstName,
    lastName,
    email,
    phone,
    avatar
  }: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    avatar?: string
  }) {
    const res = await this.query<any>(ACCOUNT_UPDATE_MUTATION, {
      input: {
        firstName,
        lastName,
      }
    });

    handleErrors(res?.accountUpdate?.errors);
    return mapSaleorUser(res.accountUpdate.user);
  }
}

// Use singleton instance
export const authService = AuthService.getInstance()
