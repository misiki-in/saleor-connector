import { BaseService } from './base.service'

/**
 * PaymentMethodService — Saleor connector. Methods mirror @misiki/litekart-connector's PaymentMethodService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class PaymentMethodService extends BaseService {
  private static instance: PaymentMethodService
  static getInstance(): PaymentMethodService {
    if (!PaymentMethodService.instance) PaymentMethodService.instance = new PaymentMethodService()
    return PaymentMethodService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const paymentMethodService = PaymentMethodService.getInstance()
