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
    // In Saleor, shipping methods are fetched directly on the Checkout object
    // returning an empty mock to fulfill the interface
    return {
      id: cartId,
      shippingCost: 0,
      orderId: "",
      userId: "",
      status: "",
      totalAmount: 0,
      paymentMethod: "",
      paymentStatus: "",
      isConfirmed: false,
      discount: 0,
      tax: 0,
      createdAt: "",
      updatedAt: ""
    } as unknown as Checkout;
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
