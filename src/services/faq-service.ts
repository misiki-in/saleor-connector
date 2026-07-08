import { BaseService } from './base.service'

/**
 * FaqService — Saleor connector. Methods mirror @misiki/litekart-connector's FaqService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class FaqService extends BaseService {
  private static instance: FaqService
  static getInstance(): FaqService {
    if (!FaqService.instance) FaqService.instance = new FaqService()
    return FaqService.instance
  }

  async listFaqs(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const faqService = FaqService.getInstance()
