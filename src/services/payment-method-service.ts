import type { PaymentMethod, PaginatedResponse } from './../types'
import { BaseService } from './base.service'

const GET_PAYMENT_GATEWAYS = `
  query GetPaymentGateways($token: UUID!) {
    checkout(token: $token) {
      availablePaymentGateways {
        id
        name
      }
    }
  }
`;

export class PaymentMethodService extends BaseService {
  private static instance: PaymentMethodService

  static getInstance(): PaymentMethodService {
    if (!PaymentMethodService.instance) {
      PaymentMethodService.instance = new PaymentMethodService()
    }
    return PaymentMethodService.instance
  }

  async list({ page = 1, q = '', sort = '-createdAt' }): Promise<PaginatedResponse<PaymentMethod>> {
    const cartId = typeof localStorage !== 'undefined' ? localStorage.getItem('cart_id') : null;
    
    if (!cartId) {
      return {
        data: [],
        count: 0,
        pageSize: 10,
        page: 1,
        noOfPage: 1
      };
    }

    try {
      const res = await this.query<any>(GET_PAYMENT_GATEWAYS, { token: cartId });
      const gateways = res?.checkout?.availablePaymentGateways || [];
      
      const mappedGateways: PaymentMethod[] = gateways.map((gw: any) => ({
        id: gw.id,
        name: gw.name,
        type: gw.id,
        value: gw.id,
        active: true,
        isTest: false,
        manualCapture: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));

      // Add COD as a fallback if gateways is empty (useful for stores without configured gateways)
      if (mappedGateways.length === 0) {
        mappedGateways.push({
          id: 'COD',
          name: 'Cash on Delivery',
          type: 'COD',
          value: 'COD',
          active: true,
          isTest: false,
          manualCapture: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      return {
        data: mappedGateways,
        count: mappedGateways.length,
        pageSize: mappedGateways.length,
        page: 1,
        noOfPage: 1
      };
    } catch (e) {
      console.error("Failed to fetch payment gateways", e);
      return {
        data: [],
        count: 0,
        pageSize: 10,
        page: 1,
        noOfPage: 1
      };
    }
  }
}

export const paymentMethodService = PaymentMethodService.getInstance()
