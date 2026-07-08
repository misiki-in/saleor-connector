import { BaseService } from './base.service'

/**
 * InitService — Saleor connector. Methods mirror @misiki/litekart-connector's InitService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class InitService extends BaseService {
  private static instance: InitService
  static getInstance(): InitService {
    if (!InitService.instance) InitService.instance = new InitService()
    return InitService.instance
  }

  async fetchInit(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const initService = InitService.getInstance()
