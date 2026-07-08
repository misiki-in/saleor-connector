import { BaseService } from './base.service'

/**
 * EnquiryService — Saleor connector. Methods mirror @misiki/litekart-connector's EnquiryService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class EnquiryService extends BaseService {
  private static instance: EnquiryService
  static getInstance(): EnquiryService {
    if (!EnquiryService.instance) EnquiryService.instance = new EnquiryService()
    return EnquiryService.instance
  }

  async create(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const enquiryService = EnquiryService.getInstance()
