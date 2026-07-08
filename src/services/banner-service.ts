import { BaseService } from './base.service'

/**
 * BannerService — Saleor connector. Methods mirror @misiki/litekart-connector's BannerService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class BannerService extends BaseService {
  private static instance: BannerService
  static getInstance(): BannerService {
    if (!BannerService.instance) BannerService.instance = new BannerService()
    return BannerService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
  async fetchBannersGroup(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const bannerService = BannerService.getInstance()
