import { BaseService } from './base.service'

/**
 * ContactService — Saleor connector. Methods mirror @misiki/litekart-connector's ContactService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class ContactService extends BaseService {
  private static instance: ContactService
  static getInstance(): ContactService {
    if (!ContactService.instance) ContactService.instance = new ContactService()
    return ContactService.instance
  }

  async submitContactUsForm(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const contactService = ContactService.getInstance()
