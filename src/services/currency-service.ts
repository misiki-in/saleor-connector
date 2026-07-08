import { BaseService } from './base.service'

/**
 * CurrencyService — Saleor connector. Methods mirror @misiki/litekart-connector's CurrencyService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class CurrencyService extends BaseService {
  private static instance: CurrencyService
  static getInstance(): CurrencyService {
    if (!CurrencyService.instance) CurrencyService.instance = new CurrencyService()
    return CurrencyService.instance
  }

  async listCurrencies(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const currencyService = CurrencyService.getInstance()
