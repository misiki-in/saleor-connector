import type { Coupon, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * CouponService provides functionality for working with specific resources.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CouponService extends BaseService {
  private static instance: CouponService

  /**
   * Get the singleton instance
   * 
   * @returns {CouponService} The singleton instance of CouponService
   */
  static getInstance(): CouponService {
    if (!CouponService.instance) {
      CouponService.instance = new CouponService()
    }
    return CouponService.instance
  }

  /**
   * Fetches Coupon from the API
   * 
   * @param {Object} options - The request options
   * @param {number} [options.page=1] - The page number for pagination
   * @param {string} [options.q=''] - Search query string
   * @param {string} [options.sort='-createdAt'] - Sort order
   * @returns {Promise<any>} The requested data
   * @api {get} /api/coupon Get coupon
   */
  // Saleor applies a voucher code to the checkout, but publishes no list of codes to a shopper.
  // Inventing one would offer codes the store will reject at the cart, so both list surfaces
  // resolve empty and the coupon drawer renders its empty state.
  async listCoupons({ page = 1, q = '', sort = '-createdAt' }: any = {}): Promise<PaginatedResponse<Coupon>> {
    return { data: [], count: 0, pageSize: 10, noOfPage: 1, page } as PaginatedResponse<Coupon>
  }

  async searchCoupons({ page = 1, q = '', sort = '-createdAt' }: any = {}): Promise<PaginatedResponse<Coupon>> {
    return { data: [], count: 0, pageSize: 10, noOfPage: 1, page } as PaginatedResponse<Coupon>
  }

  /**
   * Fetches a single Coupon by ID
   * 
   * @param {string} id - The ID of the coupon to fetch
   * @returns {Promise<any>} The requested coupon
   * @api {get} /api/coupon/:id Get coupon by ID
   */
  // A voucher record is admin data on Saleor; a shopper only ever applies a code to their
  // checkout. Reading or writing one from the storefront fails loudly rather than mutating an
  // in-memory list that no Saleor server ever sees.
  async getCoupon(id: string): Promise<Coupon> {
    throw new Error('Coupons cannot be read individually on this store.')
  }

  /**
   * Creates a new Coupon
   *
   * @param {any} data - The data to create
   * @returns {Promise<any>} The created coupon
   * @api {post} /api/coupon Create coupon
   */
  async createCoupon(coupons: Omit<Coupon, 'id'>): Promise<Coupon> {
    throw new Error('Coupons are managed in the Saleor dashboard, not from the storefront.')
  }

  async patchCoupon(id: string, coupons: Partial<Coupon>): Promise<Coupon> {
    throw new Error('Coupons are managed in the Saleor dashboard, not from the storefront.')
  }

  async deleteCoupon(id: string): Promise<Coupon> {
    throw new Error('Coupons are managed in the Saleor dashboard, not from the storefront.')
  }
}

// Use singleton instance
export const couponService = CouponService.getInstance()
