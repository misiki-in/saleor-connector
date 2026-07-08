import { BaseService } from './base.service'

/**
 * CouponService — Saleor connector. Methods mirror @misiki/litekart-connector's CouponService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class CouponService extends BaseService {
  private static instance: CouponService
  static getInstance(): CouponService {
    if (!CouponService.instance) CouponService.instance = new CouponService()
    return CouponService.instance
  }

  async listCoupons(..._args: any[]): Promise<any> { return this.emptyPage() }
  async searchCoupons(..._args: any[]): Promise<any> { return this.emptyPage() }
  async getCoupon(..._args: any[]): Promise<any> { return this.dummy({}) }
  async createCoupon(..._args: any[]): Promise<any> { return this.dummy({}) }
  async patchCoupon(..._args: any[]): Promise<any> { return this.dummy({}) }
  async deleteCoupon(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const couponService = CouponService.getInstance()
