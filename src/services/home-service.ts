import { BaseService } from './base.service'

/**
 * HomeService — Saleor connector. Methods mirror @misiki/litekart-connector's HomeService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class HomeService extends BaseService {
  private static instance: HomeService
  static getInstance(): HomeService {
    if (!HomeService.instance) HomeService.instance = new HomeService()
    return HomeService.instance
  }

  async getHome(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const homeService = HomeService.getInstance()
