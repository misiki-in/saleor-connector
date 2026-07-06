import type { User } from '../types'
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
 * UserService provides functionality for user account management
 * in the Litekart platform.
 *
 * This service helps with:
 * - User authentication (registration, login, logout)
 * - Profile management and updates
 * - Password reset and account recovery workflows
 */
export class UserService extends BaseService {
  private static instance: UserService

  /**
   * Get the singleton instance
   *
   * @returns {UserService} The singleton instance of UserService
   */
  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  /**
   * Retrieves the currently authenticated user's profile
   */
  async getMe() {
    const res = await this.query<any>(ME_QUERY);
    if (!res?.me) throw new Error("Not authenticated");
    return mapSaleorUser(res.me);
  }

  /**
   * Retrieves a specific user by ID
   */
  async getUser(id: string) {
    const res = await this.query<any>(USER_QUERY, { id });
    if (!res?.user) throw new Error("User not found");
    return mapSaleorUser(res.user);
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
    cartId = null,
    origin
  }: {
    firstName: string
    lastName: string
    phone: string
    email: string
    password: string
    passwordConfirmation: string | null
    cartId?: string | null
    origin: string
  }) {
    //if (password !== passwordConfirmation) {
    //  throw new Error("Passwords do not match");
    //}
    
    const res = await this.query<any>(ACCOUNT_REGISTER_MUTATION, {
      input: {
        firstName,
        lastName,
        email,
        password,
        channel: "default-channel",
        redirectUrl: `${origin}/auth/verify`
      }
    });

    handleErrors(res?.accountRegister?.errors);
    return mapSaleorUser(res.accountRegister.user);
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
   * Initiates a password reset workflow
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

  async joinAsVendor(data: any) {
    throw new Error("joinAsVendor is not natively supported in Saleor without a custom App.");
    return {} as User;
  }

  async changePassword(body: { old: string; password: string }) {
    const res = await this.query<any>(PASSWORD_CHANGE_MUTATION, {
      oldPassword: body.old,
      newPassword: body.password
    });

    handleErrors(res?.passwordChange?.errors);
    return mapSaleorUser(res.passwordChange.user);
  }

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

  async getOtp(data: any) {
    throw new Error("OTP functionality is not supported in Saleor natively.");
    return { otp: '000000' };
  }

  async verifyOtp({ phone, otp }: { phone: string; otp: string }) {
    throw new Error("OTP verification is not supported in Saleor natively.");
    return {} as User;
  }

  async checkEmail(email: string) {
    throw new Error("Checking email is not natively supported in Saleor without staff permissions.");
    return { exists: false };
  }

  async deleteUser(id: string) {
    throw new Error("User deletion is not natively supported in Saleor without staff permissions.");
    return { success: false };
  }
}

// Use singleton instance
export const userService = UserService.getInstance()
