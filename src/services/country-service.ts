import { BaseService } from './base.service'

/**
 * CountryService — Saleor connector. Methods mirror @misiki/litekart-connector's CountryService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class CountryService extends BaseService {
  private static instance: CountryService
  static getInstance(): CountryService {
    if (!CountryService.instance) CountryService.instance = new CountryService()
    return CountryService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const countryService = CountryService.getInstance()
