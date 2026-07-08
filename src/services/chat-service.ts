import { BaseService } from './base.service'

/**
 * ChatService — Saleor connector. Methods mirror @misiki/litekart-connector's ChatService.
 * Present-but-dummy for capabilities Saleor does not expose (returns dummy data,
 * never throws) so kitcommerce-core never hits `undefined is not a function`.
 */
export class ChatService extends BaseService {
  private static instance: ChatService
  static getInstance(): ChatService {
    if (!ChatService.instance) ChatService.instance = new ChatService()
    return ChatService.instance
  }

  async list(..._args: any[]): Promise<any> { return this.emptyPage() }
}

export const chatService = ChatService.getInstance()
