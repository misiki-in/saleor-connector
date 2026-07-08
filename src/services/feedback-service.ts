import { BaseService } from './base.service'

/**
 * FeedbackService — Saleor connector. Methods mirror @misiki/litekart-connector's FeedbackService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class FeedbackService extends BaseService {
  private static instance: FeedbackService
  static getInstance(): FeedbackService {
    if (!FeedbackService.instance) FeedbackService.instance = new FeedbackService()
    return FeedbackService.instance
  }

  async listFeedbacks(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const feedbackService = FeedbackService.getInstance()
