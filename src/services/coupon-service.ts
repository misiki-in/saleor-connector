import type { Coupon, PaginatedResponse } from './../types'

import { BaseService } from './base.service'

/**
 * CouponService provides functionality for working with specific resources
 * in the Litekart API.
 *
 * This service helps with:
 * - Main functionality point 1
 * - Main functionality point 2
 * - Main functionality point 3
 */
export class CouponService extends BaseService {
  private static instance: CouponService

  private dummyCoupons: Coupon[] = [
    {
      id: '1',
      code: 'SUMMER20',
      amount: 20,
      type: 'TOTAL',
      maxAmount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      code: 'WELCOME10',
      amount: 10,
      type: 'USER',
      maxAmount: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]

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
  async listCoupons({ page = 1, q = '', sort = '-createdAt' }: any = {}): Promise<PaginatedResponse<Coupon>> {
    return {
      data: this.dummyCoupons,
      count: this.dummyCoupons.length,
      pageSize: 10,
      noOfPage: 1,
      page: page
    }
  }

  async searchCoupons({ page = 1, q = '', sort = '-createdAt' }: any = {}): Promise<PaginatedResponse<Coupon>> {
    return {
      data: this.dummyCoupons,
      count: this.dummyCoupons.length,
      pageSize: 10,
      noOfPage: 1,
      page: page
    }
  }

  /**
   * Fetches a single Coupon by ID
   * 
   * @param {string} id - The ID of the coupon to fetch
   * @returns {Promise<any>} The requested coupon
   * @api {get} /api/coupon/:id Get coupon by ID
   */
  async getCoupon(id: string): Promise<Coupon> {
    const coupon = this.dummyCoupons.find(c => c.id === id)
    if (!coupon) {
      throw new Error(`Coupon with ID ${id} not found`)
    }
    return coupon
  }

  /**
   * Creates a new Coupon
   * 
   * @param {any} data - The data to create
   * @returns {Promise<any>} The created coupon
   * @api {post} /api/coupon Create coupon
   */
  async createCoupon(coupons: Omit<Coupon, 'id'>): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...coupons,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    this.dummyCoupons.push(newCoupon)
    return newCoupon
  }

  async patchCoupon(id: string, coupons: Partial<Coupon>): Promise<Coupon> {
    const index = this.dummyCoupons.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Coupon with ID ${id} not found`)
    }
    const updatedCoupon = {
      ...this.dummyCoupons[index],
      ...coupons,
      updatedAt: new Date().toISOString()
    }
    this.dummyCoupons[index] = updatedCoupon
    return updatedCoupon
  }

  async deleteCoupon(id: string): Promise<Coupon> {
    const index = this.dummyCoupons.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error(`Coupon with ID ${id} not found`)
    }
    const [deletedCoupon] = this.dummyCoupons.splice(index, 1)
    return deletedCoupon
  }
}

// Use singleton instance
export const couponService = CouponService.getInstance()
