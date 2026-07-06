import type { Address, Cart, CartLineItem } from './../types'
import { BaseService } from './base.service'

const CHECKOUT_FRAGMENT = `
  fragment CheckoutDetails on Checkout {
    id
    token
    email
    isShippingRequired
    quantity
    discountName
    discount {
      amount
    }
    channel {
      id
    }
    billingAddress {
      id
      firstName
      lastName
      streetAddress1
      streetAddress2
      city
      countryArea
      postalCode
      country {
        code
        country
      }
      phone
    }
    shippingAddress {
      id
      firstName
      lastName
      streetAddress1
      streetAddress2
      city
      countryArea
      postalCode
      country {
        code
        country
      }
      phone
    }
    shippingPrice {
      gross {
        amount
      }
    }
    subtotalPrice {
      gross {
        amount
      }
    }
    totalPrice {
      gross {
        amount
      }
      net {
        amount
      }
    }
    deliveryMethod {
      ... on ShippingMethod {
        id
      }
    }
    lines {
      id
      quantity
      totalPrice {
        gross {
          amount
        }
      }
      undiscountedTotalPrice {
        amount
      }
      variant {
        id
        name
        sku
        weight {
          value
          unit
        }
        product {
          id
          name
          slug
          description
          thumbnail {
            url
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

const GET_CHECKOUT = `
  ${CHECKOUT_FRAGMENT}
  query GetCheckout($token: UUID!) {
    checkout(token: $token) {
      ...CheckoutDetails
    }
  }
`;

const CHECKOUT_CREATE = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_LINES_ADD = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutLinesAdd($id: ID, $lines: [CheckoutLineInput!]!) {
    checkoutLinesAdd(id: $id, lines: $lines) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_LINES_UPDATE = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutLinesUpdate($id: ID, $lines: [CheckoutLineUpdateInput!]!) {
    checkoutLinesUpdate(id: $id, lines: $lines) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_LINE_DELETE = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutLineDelete($id: ID, $lineId: ID) {
    checkoutLineDelete(id: $id, lineId: $lineId) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_ADD_PROMO = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutAddPromo($id: ID, $promoCode: String!) {
    checkoutAddPromoCode(id: $id, promoCode: $promoCode) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_REMOVE_PROMO = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutRemovePromo($id: ID, $promoCode: String!) {
    checkoutRemovePromoCode(id: $id, promoCode: $promoCode) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_EMAIL_UPDATE = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutEmailUpdate($id: ID, $email: String!) {
    checkoutEmailUpdate(id: $id, email: $email) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_SHIPPING_ADDRESS_UPDATE = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutShippingAddressUpdate($id: ID, $address: AddressInput!) {
    checkoutShippingAddressUpdate(id: $id, shippingAddress: $address) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_BILLING_ADDRESS_UPDATE = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutBillingAddressUpdate($id: ID, $address: AddressInput!) {
    checkoutBillingAddressUpdate(id: $id, billingAddress: $address) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_DELIVERY_METHOD_UPDATE = `
  ${CHECKOUT_FRAGMENT}
  mutation CheckoutDeliveryMethodUpdate($id: ID, $deliveryMethodId: ID) {
    checkoutDeliveryMethodUpdate(id: $id, deliveryMethodId: $deliveryMethodId) {
      checkout {
        ...CheckoutDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const CHECKOUT_COMPLETE = `
  mutation CheckoutComplete($id: ID) {
    checkoutComplete(id: $id) {
      order {
        id
        token
        userEmail
        billingAddress { id }
        shippingAddress { id }
        total { gross { amount } net { amount } }
        subtotal { gross { amount } }
        shippingPrice { gross { amount } }
        lines {
          id
          quantity
          variant {
            id
            product { id }
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

function mapSaleorCheckoutAddress(node: any): Address | null {
  if (!node) return null;
  return {
    id: node.id,
    active: true,
    address_1: node.streetAddress1 || null,
    address_2: node.streetAddress2 || null,
    city: node.city || null,
    country: node.country?.country || null,
    deliveryInstructions: null,
    email: null,
    firstName: node.firstName || null,
    isPrimary: false,
    isResidential: false,
    lastName: node.lastName || null,
    lat: null,
    lng: null,
    locality: null,
    phone: node.phone || null,
    state: node.countryArea || null,
    userId: null,
    zip: node.postalCode || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    countryCode: node.country?.code || null
  };
}

function mapSaleorCheckoutToCart(node: any): Cart {
  if (!node) return {} as Cart;
  return {
    id: node.token || node.id,
    email: node.email || node.userEmail || null,
    phone: null,
    lineItems: node.lines?.map((line: any) => {
      const qty = line.quantity || 1;
      const total = line.totalPrice?.gross?.amount || 0;
      const undiscountedTotal = line.undiscountedTotalPrice?.amount || total;
      const price = total / qty;
      const mrp = undiscountedTotal / qty;
      
      const v = line.variant || {};
      const p = v.product || {};
      
      return {
        id: line.id,
        productId: p.id,
        variantId: v.id,
        qty: qty,
        subtotal: total,
        discount: undiscountedTotal - total,
        tax: 0,
        shippingCharges: 0,
        total: total,
        price: price,
        mrp: mrp,
        title: p.name || "",
        slug: p.slug || "",
        sku: v.sku || "",
        description: p.description ? (typeof p.description === 'string' ? p.description : JSON.stringify(p.description)) : "",
        thumbnail: p.thumbnail?.url || "",
        metadata: null,
        vendorId: null,
        weight: v.weight?.value || null,
        dimensionUnit: v.weight?.unit || "cm",
        height: null,
        width: null,
        len: null,
        shippingWeight: null,
        shippingHeight: null,
        shippingLen: null,
        shippingWidth: null,
        isSelectedForCheckout: true,
        createdAt: null,
        product: {
          id: p.id,
          title: p.name || "",
          thumbnail: p.thumbnail?.url || "",
          slug: p.slug || "",
          sku: v.sku || "",
          categories: p.category ? [{
            id: p.category.id,
            category: {
              name: p.category.name,
              id: p.category.id
            }
          }] : []
        },
        variant: {
          id: v.id,
          price: price,
          mrp: mrp,
          weight: v.weight?.value || null,
          height: null,
          width: null,
          len: null,
          shippingWeight: null,
          shippingHeight: null,
          shippingLen: null,
          shippingWidth: null,
          sku: v.sku || "",
          title: v.name || "default",
          options: []
        }
      };
    }) || [],
    billingAddressId: node.billingAddress?.id || null,
    shippingAddressId: node.shippingAddress?.id || null,
    billingAddress: mapSaleorCheckoutAddress(node.billingAddress) || undefined,
    shippingAddress: mapSaleorCheckoutAddress(node.shippingAddress) || undefined,
    regionId: null,
    userId: node.user?.id || null,
    salesChannelId: node.channel?.id || null,
    storeId: "default",
    couponCode: node.discountName || null,
    discountAmount: node.discount?.amount || 0,
    couponAppliedDate: null,
    paymentId: null,
    paymentMethod: null,
    paymentAuthorizedAt: null,
    needAddress: node.isShippingRequired ?? false,
    isCodAvailable: false,
    type: "checkout",
    completedAt: null,
    idempotencyKey: null,
    shippingCharges: node.shippingPrice?.gross?.amount || 0,
    shippingMethod: node.deliveryMethod?.id || null,
    qty: node.quantity || (node.lines?.reduce((acc: number, l: any) => acc + l.quantity, 0) || 0),
    subtotal: node.subtotalPrice?.gross?.amount || node.subtotal?.gross?.amount || 0,
    codCharges: 0,
    tax: ((node.totalPrice?.gross?.amount || node.total?.gross?.amount || 0) - (node.totalPrice?.net?.amount || node.total?.net?.amount || 0)),
    total: node.totalPrice?.gross?.amount || node.total?.gross?.amount || 0,
    savingAmount: node.discount?.amount || 0
  };
}

function handleErrors(errors?: any[]) {
  if (errors && errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(', '));
  }
}

export class CartService extends BaseService {
  private static instance: CartService

  static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService()
    }
    return CartService.instance
  }

  getGlobalCheckoutId(cartId: string): string {
    if (!cartId) return cartId;
    if (cartId.startsWith('Checkout:')) return cartId; // Already a global ID in raw form
    if (cartId.length === 36 || cartId.includes('-')) {
      // It's a UUID, convert to Global ID
      const raw = `Checkout:${cartId}`;
      return typeof window !== 'undefined' ? btoa(raw) : Buffer.from(raw).toString('base64');
    }
    return cartId; // Assume it's already a base64 encoded global ID
  }

  async fetchCartData() {
    const cartId = typeof localStorage !== 'undefined' ? localStorage.getItem('cart_id') : null;
    if (!cartId) return {} as Cart;
    return this.getCartByCartId(cartId);
  }

  async refereshCart() {
    const cartId = typeof localStorage !== 'undefined' ? localStorage.getItem('cart_id') : null;
    if (!cartId) return {} as Cart;
    return this.getCartByCartId(cartId);
  }

  async getCartByCartId(cartId: string) {
    const res = await this.query<any>(GET_CHECKOUT, { token: cartId });
    return mapSaleorCheckoutToCart(res?.checkout);
  }

  async resolveVariantId(id: string): Promise<string> {
    try {
      const decoded = typeof window !== 'undefined' ? atob(id) : Buffer.from(id, 'base64').toString('utf8');
      if (decoded.startsWith('ProductVariant:')) {
        return id;
      }
      if (decoded.startsWith('Product:')) {
        const GET_VARIANT = `
          query GetVariant($id: ID!) {
            product(id: $id, channel: "default-channel") {
              variants {
                id
              }
            }
          }
        `;
        const res = await this.query<any>(GET_VARIANT, { id });
        if (res?.product?.variants?.length > 0) {
          return res.product.variants[0].id;
        }
      }
    } catch (e) {
      // ignore errors, just return original id
    }
    return id;
  }

  async addToCart({
    productId,
    variantId,
    qty,
    cartId,
    lineId
  }: {
    productId: string
    variantId: string
    qty: number
    cartId?: string | null
    lineId: string | null
  }) {
    if (cartId === undefined || cartId === 'undefined') {
      cartId = typeof localStorage !== 'undefined' ? localStorage.getItem('cart_id') : null;
    }

    let resolvedVariantId = variantId || productId;
    if (resolvedVariantId) {
      resolvedVariantId = await this.resolveVariantId(resolvedVariantId);
    }

    if (!cartId) {
      const lines = resolvedVariantId ? [{ variantId: resolvedVariantId, quantity: qty }] : [];
      const res = await this.query<any>(CHECKOUT_CREATE, {
        input: {
          channel: "default-channel",
          lines: lines
        }
      });
      handleErrors(res?.checkoutCreate?.errors);
      const checkout = res?.checkoutCreate?.checkout;
      if (typeof localStorage !== 'undefined' && checkout?.token) {
        localStorage.setItem('cart_id', checkout.token);
      }
      return mapSaleorCheckoutToCart(checkout);
    }

    if (qty === -9999999 && lineId) {
      const res = await this.query<any>(CHECKOUT_LINE_DELETE, {
        id: this.getGlobalCheckoutId(cartId),
        lineId
      });
      handleErrors(res?.checkoutLineDelete?.errors);
      return mapSaleorCheckoutToCart(res?.checkoutLineDelete?.checkout);
    }

    if (lineId) {
      const res = await this.query<any>(CHECKOUT_LINES_UPDATE, {
        id: this.getGlobalCheckoutId(cartId),
        lines: [{ lineId, quantity: qty }]
      });
      handleErrors(res?.checkoutLinesUpdate?.errors);
      return mapSaleorCheckoutToCart(res?.checkoutLinesUpdate?.checkout);
    }

    if (!variantId && !productId) {
      return this.getCartByCartId(cartId);
    }

    const res = await this.query<any>(CHECKOUT_LINES_ADD, {
      id: this.getGlobalCheckoutId(cartId),
      lines: [{ variantId: resolvedVariantId, quantity: qty }]
    });
    handleErrors(res?.checkoutLinesAdd?.errors);
    return mapSaleorCheckoutToCart(res?.checkoutLinesAdd?.checkout);
  }

  async removeCart({
    cartId,
    lineId = null
  }: {
    cartId: string
    lineId: string | null
  }) {
    if (cartId === undefined || cartId === 'undefined') {
      cartId = typeof localStorage !== 'undefined' ? (localStorage.getItem('cart_id') || "") : "";
    }

    if (!cartId) return {} as Cart;

    if (lineId) {
      const res = await this.query<any>(CHECKOUT_LINE_DELETE, {
        id: this.getGlobalCheckoutId(cartId),
        lineId
      });
      handleErrors(res?.checkoutLineDelete?.errors);
      return mapSaleorCheckoutToCart(res?.checkoutLineDelete?.checkout);
    }
    return {} as Cart;
  }

  async applyCoupon({
    cartId,
    couponCode
  }: {
    cartId: string
    couponCode: string
  }) {
    const res = await this.query<any>(CHECKOUT_ADD_PROMO, {
      id: this.getGlobalCheckoutId(cartId),
      promoCode: couponCode
    });
    handleErrors(res?.checkoutAddPromoCode?.errors);
    return mapSaleorCheckoutToCart(res?.checkoutAddPromoCode?.checkout);
  }

  async removeCoupon() {
    const cartId = typeof localStorage !== 'undefined' ? (localStorage.getItem('cart_id') || "") : "";
    if (!cartId) return {} as Cart;
    const checkoutData = await this.query<any>(GET_CHECKOUT, { token: cartId });
    const promoCode = checkoutData?.checkout?.discountName;
    if (!promoCode) return mapSaleorCheckoutToCart(checkoutData?.checkout);

    const res = await this.query<any>(CHECKOUT_REMOVE_PROMO, {
      id: this.getGlobalCheckoutId(cartId),
      promoCode
    });
    handleErrors(res?.checkoutRemovePromoCode?.errors);
    return mapSaleorCheckoutToCart(res?.checkoutRemovePromoCode?.checkout);
  }

  async updateCart2({
    storeId,
    cartId,
    email,
    billingAddress,
    customer_id,
    shippingAddress,
    phone,
    isBillingAddressSameAsShipping
  }: any) {
    if (!cartId || cartId === undefined || cartId === 'undefined') {
      cartId = typeof localStorage !== 'undefined' ? (localStorage.getItem('cart_id') || "") : "";
    }
    if (!cartId) return {} as Cart;

    let currentCheckout: any = null;
    
    if (email) {
      const res = await this.query<any>(CHECKOUT_EMAIL_UPDATE, {
        id: this.getGlobalCheckoutId(cartId),
        email
      });
      handleErrors(res?.checkoutEmailUpdate?.errors);
      currentCheckout = res?.checkoutEmailUpdate?.checkout;
    }

    if (shippingAddress) {
      const phoneStr = shippingAddress.phone || phone || "";
      const formattedPhone = phoneStr && !phoneStr.startsWith('+') && phoneStr.replace(/\\D/g, '').length === 10 
        ? `+91${phoneStr.replace(/\\D/g, '')}` 
        : phoneStr;

      const addressInput = {
        firstName: shippingAddress.firstName || "",
        lastName: shippingAddress.lastName || "",
        streetAddress1: shippingAddress.address_1 || "",
        streetAddress2: shippingAddress.address_2 || "",
        city: shippingAddress.city || "",
        countryArea: shippingAddress.state || "",
        postalCode: shippingAddress.zip || "",
        country: shippingAddress.countryCode || "IN",
        phone: formattedPhone
      };
      const res = await this.query<any>(CHECKOUT_SHIPPING_ADDRESS_UPDATE, {
        id: this.getGlobalCheckoutId(cartId),
        address: addressInput
      });
      handleErrors(res?.checkoutShippingAddressUpdate?.errors);
      currentCheckout = res?.checkoutShippingAddressUpdate?.checkout;
    }

    if (billingAddress && !isBillingAddressSameAsShipping) {
      const phoneStr = billingAddress.phone || phone || "";
      const formattedPhone = phoneStr && !phoneStr.startsWith('+') && phoneStr.replace(/\\D/g, '').length === 10 
        ? `+91${phoneStr.replace(/\\D/g, '')}` 
        : phoneStr;

      const addressInput = {
        firstName: billingAddress.firstName || "",
        lastName: billingAddress.lastName || "",
        streetAddress1: billingAddress.address_1 || "",
        streetAddress2: billingAddress.address_2 || "",
        city: billingAddress.city || "",
        countryArea: billingAddress.state || "",
        postalCode: billingAddress.zip || "",
        country: billingAddress.countryCode || "IN",
        phone: formattedPhone
      };
      const res = await this.query<any>(CHECKOUT_BILLING_ADDRESS_UPDATE, {
        id: this.getGlobalCheckoutId(cartId),
        address: addressInput
      });
      handleErrors(res?.checkoutBillingAddressUpdate?.errors);
      currentCheckout = res?.checkoutBillingAddressUpdate?.checkout;
    } else if (shippingAddress && isBillingAddressSameAsShipping) {
      const phoneStr = shippingAddress.phone || phone || "";
      const formattedPhone = phoneStr && !phoneStr.startsWith('+') && phoneStr.replace(/\\D/g, '').length === 10 
        ? `+91${phoneStr.replace(/\\D/g, '')}` 
        : phoneStr;

      const addressInput = {
        firstName: shippingAddress.firstName || "",
        lastName: shippingAddress.lastName || "",
        streetAddress1: shippingAddress.address_1 || "",
        streetAddress2: shippingAddress.address_2 || "",
        city: shippingAddress.city || "",
        countryArea: shippingAddress.state || "",
        postalCode: shippingAddress.zip || "",
        country: shippingAddress.countryCode || "IN",
        phone: formattedPhone
      };
      const res = await this.query<any>(CHECKOUT_BILLING_ADDRESS_UPDATE, {
        id: this.getGlobalCheckoutId(cartId),
        address: addressInput
      });
      handleErrors(res?.checkoutBillingAddressUpdate?.errors);
      currentCheckout = res?.checkoutBillingAddressUpdate?.checkout;
    }

    if (!currentCheckout) {
      return this.getCartByCartId(cartId);
    }
    return mapSaleorCheckoutToCart(currentCheckout);
  }

  async completeCart(cart_id: string) {
    const res = await this.query<any>(CHECKOUT_COMPLETE, { id: this.getGlobalCheckoutId(cart_id) });
    handleErrors(res?.checkoutComplete?.errors);
    return mapSaleorCheckoutToCart(res?.checkoutComplete?.order);
  }

  async updateCart({
    qty,
    cartId,
    lineId = null,
    productId,
    variantId,
    isSelectedForCheckout
  }: any) {
    return this.addToCart({ productId, variantId, qty, cartId, lineId });
  }

  async updateShippingRate({
    cartId,
    shippingRateId
  }: {
    cartId: string
    shippingRateId: string
  }) {
    const res = await this.query<any>(CHECKOUT_DELIVERY_METHOD_UPDATE, {
      id: this.getGlobalCheckoutId(cartId),
      deliveryMethodId: shippingRateId
    });
    handleErrors(res?.checkoutDeliveryMethodUpdate?.errors);
    return mapSaleorCheckoutToCart(res?.checkoutDeliveryMethodUpdate?.checkout);
  }
}

export const cartService = CartService.getInstance()
