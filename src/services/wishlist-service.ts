import { BaseService } from './base.service'

/**
 * WishlistService — Saleor connector. Methods mirror @misiki/litekart-connector's WishlistService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class WishlistService extends BaseService {
  private static instance: WishlistService
  static getInstance(): WishlistService {
    if (!WishlistService.instance) WishlistService.instance = new WishlistService()
    return WishlistService.instance
  }

  async fetchWishlist(..._args: any[]): Promise<any> { return this.dummy({}) }
  async checkWishlist(..._args: any[]): Promise<any> { return this.dummy({}) }
  async checkWishlistInBulk(..._args: any[]): Promise<any> { return this.dummy({}) }
  async toggleWishlist(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const wishlistService = WishlistService.getInstance()
