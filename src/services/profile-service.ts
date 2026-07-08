import { BaseService } from './base.service'

/**
 * ProfileService — Saleor connector. Methods mirror @misiki/litekart-connector's ProfileService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class ProfileService extends BaseService {
  private static instance: ProfileService
  static getInstance(): ProfileService {
    if (!ProfileService.instance) ProfileService.instance = new ProfileService()
    return ProfileService.instance
  }

  async getOne(..._args: any[]): Promise<any> { return this.dummy({}) }
  async save(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const profileService = ProfileService.getInstance()
