import { BaseService } from './base.service'

/**
 * ReviewService — Saleor connector. Methods mirror @misiki/litekart-connector's ReviewService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class ReviewService extends BaseService {
  private static instance: ReviewService
  static getInstance(): ReviewService {
    if (!ReviewService.instance) ReviewService.instance = new ReviewService()
    return ReviewService.instance
  }

  async fetchReviews(..._args: any[]): Promise<any> { return this.emptyPage() }
  async allReviews(..._args: any[]): Promise<any> { return this.emptyPage() }
  async fetchProducrReviews(..._args: any[]): Promise<any> { return this.emptyPage() }
  async saveReview(..._args: any[]): Promise<any> { return this.dummy({}) }
}

export const reviewService = ReviewService.getInstance()
