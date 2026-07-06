import type { Cart, Checkout } from './../types'
import { BaseService } from './base.service'
import { cartService } from './cart-service'

const CHECKOUT_COMPLETE = `
  mutation CheckoutComplete($id: ID!) {
    checkoutComplete(id: $id) {
      order {
        id
      }
      errors {
        field
        message
      }
    }
  }
`;

const DELIVERY_OPTIONS_CALCULATE = `
  mutation DeliveryOptionsCalculate($id: ID!) {
    deliveryOptionsCalculate(id: $id) {
      deliveries {
        id
        shippingMethod {
          name
          active
          price {
            amount
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

export class CheckoutService extends BaseService {
  private static instance: CheckoutService

  static getInstance(): CheckoutService {
    if (!CheckoutService.instance) {
      CheckoutService.instance = new CheckoutService()
    }
    return CheckoutService.instance
  }

  async checkoutCOD({ cartId, origin }: { cartId: string; origin: string }) {
    const globalId = cartService.getGlobalCheckoutId(cartId);
    const res = await this.query<any>(CHECKOUT_COMPLETE, { id: globalId });
    
    if (res?.checkoutComplete?.errors?.length > 0) {
      throw new Error(res.checkoutComplete.errors.map((e: any) => e.message).join(', '));
    }
    
    return cartService.getCartByCartId(cartId);
  }

  async checkoutRazorpay({ cartId, origin }: { cartId: string; origin: string }) {
    throw new Error("checkoutRazorpay not implemented for Saleor");
  }

  async checkoutPOS({ cartId, origin }: { cartId: string; origin: string }) {
    throw new Error("checkoutPOS not implemented for Saleor");
  }

  async captureRazorpayPayment({
    razorpay_order_id,
    razorpay_payment_id
  }: {
    razorpay_order_id: string
    razorpay_payment_id: string
  }) {
    throw new Error("captureRazorpayPayment not implemented for Saleor");
  }

  async checkoutPhonepe({
    cartId,
    email,
    phone,
    origin
  }: {
    cartId: string
    email: string
    phone: string
    origin: string
  }) {
    throw new Error("checkoutPhonepe not implemented for Saleor");
  }

  async getShippingRates({ cartId }: { cartId: string }) {
    const globalId = cartService.getGlobalCheckoutId(cartId);
    const res = await this.query<any>(DELIVERY_OPTIONS_CALCULATE, { id: globalId });

    if (res?.deliveryOptionsCalculate?.errors?.length > 0) {
      throw new Error(res.deliveryOptionsCalculate.errors.map((e: any) => e.message).join(', '));
    }

    const deliveries = res?.deliveryOptionsCalculate?.deliveries || [];
    const mappedDeliveries = deliveries.map((d: any) => ({
      id: d.id,
      active: d.shippingMethod?.active ?? true,
      name: d.shippingMethod?.name || "",
      store_id: "",
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: "",
      zone_type: "domestic",
      taxable: true,
      priority: 0,
      price_adjustment: 0,
      currency_code: null,
      min_order_value: null,
      max_order_value: null,
      restricted_categories: null,
      deleted_at: null,
      zone_id: "",
      method_type: "weight",
      free_shipping_threshold: 0,
      base_rate: d.shippingMethod?.price?.amount || 0,
      rate_per_weight: 0,
      rate_per_price: 0,
      max_weight: null,
      max_length: null,
      max_width: null,
      max_height: null,
      handling_fee: 0,
      min_order_amount: 0,
      max_order_amount: null,
      min_weight: 0,
      restricted_items: null,
      provider_id: null,
      provider_service_code: null,
      rank: 0,
      estimated_min_days: 0,
      estimated_max_days: 5
    }));

    return {
      message: "Shipping rates fetched successfully",
      success: true,
      error: null,
      data: mappedDeliveries
    } as any;
  }

  async capturePhonepePayment({
    phonepe_order_id,
    phonepe_payment_id
  }: {
    phonepe_order_id: string
    phonepe_payment_id: string
  }) {
    throw new Error("capturePhonepePayment not implemented for Saleor");
  }

  async checkoutPaypal({
    cartId,
    origin,
    return_url
  }: {
    cartId: string
    origin: string
    return_url: string
  }) {
    throw new Error("checkoutPaypal not implemented for Saleor");
  }

  async checkoutStripe({ cartId, origin }: { cartId: string; origin: string }) {
    throw new Error("checkoutStripe not implemented for Saleor");
  }

  async checkoutStripeCapture({
    order_no,
    pg,
    payment_session_id,
    storeId
  }: {
    order_no: string
    pg: string
    payment_session_id: string
    storeId: string
  }) {
    throw new Error("checkoutStripeCapture not implemented for Saleor");
  }

  async createAffirmPayOrder({
    cartId,
    addressId,
    origin,
    storeId,
    paymentMethodId
  }: {
    cartId: string
    addressId: string
    origin: string
    storeId: string
    paymentMethodId: string
  }) {
    throw new Error("createAffirmPayOrder not implemented for Saleor");
  }

  async cancelAffirmOrder({
    orderId,
    storeId,
    origin
  }: {
    orderId: string
    storeId: string
    origin: string
  }) {
    throw new Error("cancelAffirmOrder not implemented for Saleor");
  }

  async confirmAffirmOrder({
    affirmToken,
    orderId,
    storeId,
    origin
  }: {
    affirmToken: string
    orderId: string
    storeId: string
    origin: string
  }) {
    throw new Error("confirmAffirmOrder not implemented for Saleor");
  }
}

export const checkoutService = CheckoutService.getInstance()
