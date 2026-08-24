import type { User } from './../types'

import { BaseService } from './base.service'
import { UserService } from './user-service'

/**
 * ProfileService provides functionality for working with specific resources.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class ProfileService extends BaseService {
  private static instance: ProfileService

  /**
   * Get the singleton instance
   */
  /**
 * Get the singleton instance
 * 
 * @returns {ProfileService} The singleton instance of ProfileService
 */
  static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService()
    }
    return ProfileService.instance
  }
  /**
 * Fetches a single Profile by ID
 * 
 * @param {string} id - The ID of the profile to fetch
 * @returns {Promise<any>} The requested profile
 * @api {get} /api/profile/:id Get profile by ID
 * 
 * @example
 * // Example usage
 * const profile = await profileService.getOne('123');
 */
  async getOne() {
    // Saleor-native: the UserService already implements the current-customer lookup. The REST
    // path this used does not exist on a Saleor server.
    return new UserService(this.getFetch()).getMe() as Promise<User>
  }

  /**
 * Creates a new Profile
 * 
 * @param {any} data - The data to create
 * @returns {Promise<any>} The created profile
 * @api {post} /api/profile Create profile
 * 
 * @example
 * // Example usage
 * const newProfile = await profileService.save({ 
 *   // required fields
 * });
 */

  async save(blog: Omit<User, 'id'>) {
    // Saleor-native profile update; `updateProfile` wants an `id` its implementation never reads.
    return new UserService(this.getFetch()).updateProfile({ id: '', ...blog } as any) as Promise<User>
  }
}

// Use singleton instance
export const profileService = ProfileService.getInstance()
