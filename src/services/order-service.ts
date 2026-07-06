import type { PaginatedResponse, Order } from './../types'
import { BaseService } from './base.service'

const ORDER_FRAGMENT = `
  fragment OrderDetails on Order {
    id
    number
    created
    updatedAt
    status
    userEmail
    isPaid
    paymentStatus
    user {
      id
    }
    shippingAddress {
      firstName
      lastName
      streetAddress1
      city
      postalCode
      country {
        code
      }
    }
    billingAddress {
      firstName
      lastName
      streetAddress1
      city
      postalCode
      country {
        code
      }
    }
    total {
      gross {
        amount
        currency
      }
    }
    subtotal {
      gross {
        amount
      }
    }
    shippingPrice {
      gross {
        amount
      }
    }
    totalGrantedRefund {
      amount
    }
    totalRefunded {
      amount
    }
  }
`;

const ORDERS_LIST = `
  ${ORDER_FRAGMENT}
  query OrdersList($first: Int!) {
    me {
      orders(first: $first) {
        edges {
          node {
            ...OrderDetails
          }
        }
        totalCount
      }
    }
  }
`;

const ORDER_BY_ID = `
  ${ORDER_FRAGMENT}
  query OrderById($id: ID!) {
    order(id: $id) {
      ...OrderDetails
    }
  }
`;

const mapSaleorOrderToLitekart = (saleorOrder: any): Order => {
  return {
    id: saleorOrder.id,
    orderNo: saleorOrder.number,
    storeId: null,
    batchNo: null,
    amount: null,
    parentOrderNo: null,
    vendorId: "",
    isEmailSentToVendor: false,
    status: saleorOrder.status,
    cartId: "",
    userId: saleorOrder.user?.id || null,
    userPhone: null,
    userFirstName: saleorOrder.billingAddress?.firstName || null,
    userLastName: saleorOrder.billingAddress?.lastName || null,
    userEmail: saleorOrder.userEmail,
    comment: null,
    needAddress: false,
    selfTakeout: false,
    shippingCharges: saleorOrder.shippingPrice?.gross?.amount || 0,
    total: saleorOrder.total?.gross?.amount || 0,
    subtotal: saleorOrder.subtotal?.gross?.amount || 0,
    discount: null,
    tax: null,
    currencySymbol: saleorOrder.total?.gross?.currency || null,
    currencyCode: saleorOrder.total?.gross?.currency || null,
    codCharges: null,
    codPaid: null,
    paid: saleorOrder.isPaid,
    paySuccess: saleorOrder.isPaid ? 1 : 0,
    amountRefunded: saleorOrder.totalRefunded?.amount || 0,
    amountDue: null,
    amountPaid: saleorOrder.isPaid ? saleorOrder.total?.gross?.amount : 0,
    totalDiscount: null,
    totalAmountRefunded: saleorOrder.totalRefunded?.amount || 0,
    paymentMethod: null,
    platform: "saleor",
    couponUsed: null,
    coupon: null,
    paymentStatus: saleorOrder.paymentStatus,
    paymentCurrency: saleorOrder.total?.gross?.currency || null,
    paymentMsg: null,
    paymentReferenceId: null,
    paymentGateway: null,
    paymentId: null,
    paymentAmount: saleorOrder.isPaid ? saleorOrder.total?.gross?.amount : 0,
    paymentMode: null,
    paymentDate: null,
    shippingAddressId: null,
    billingAddressId: null,
    shippingAddress: saleorOrder.shippingAddress || null,
    billingAddress: saleorOrder.billingAddress || null,
    createdAt: saleorOrder.created,
    updatedAt: saleorOrder.updatedAt
  } as Order;
};

/**
 * OrderService provides functionality for working with specific resources
 * in the Litekart API.
 */
export class OrderService extends BaseService {
  private static instance: OrderService

  static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService()
    }
    return OrderService.instance
  }

  async list({ page = 1, q = '', sort = '-createdAt' }) {
    const res = await this.query<any>(ORDERS_LIST, { first: 50 });
    const orders = res?.me?.orders?.edges?.map((e: any) => mapSaleorOrderToLitekart(e.node)) || [];
    return {
      data: orders,
      count: res?.me?.orders?.totalCount || orders.length,
      page: 1,
      pageSize: 50,
      totalPages: 1,
      noOfPage: 1
    } as unknown as PaginatedResponse<Order>;
  }

  async listOrdersByParent({ orderNo, cartId }: { orderNo: string | null; cartId: string | null }) {
    const res = await this.query<any>(ORDERS_LIST, { first: 50 });
    let orders = res?.me?.orders?.edges?.map((e: any) => mapSaleorOrderToLitekart(e.node)) || [];

    if (orderNo) {
      orders = orders.filter((o: Order) => o.id === orderNo || String(o.orderNo) === orderNo);
    }

    return {
      data: orders,
      count: orders.length,
      page: 1,
      pageSize: 50,
      totalPages: 1,
      noOfPage: 1
    } as unknown as PaginatedResponse<Order>;
  }

  async fetchOrder(id: string) {
    const res = await this.query<any>(ORDER_BY_ID, { id });
    if (!res?.order) throw new Error("Order not found");
    return mapSaleorOrderToLitekart(res.order);
  }

  async getOrder(orderNo: string) {
    const res = await this.query<any>(ORDER_BY_ID, { id: orderNo });
    if (!res?.order) throw new Error("Order not found");
    return mapSaleorOrderToLitekart(res.order);
  }

  async fetchTrackOrder(id: string) {
    throw new Error("Not implemented for Saleor");
  }

  async paySuccessPageHit(orderId: string) {
    throw new Error("Not implemented for Saleor");
  }

  async codCheckout(params: any) {
    throw new Error("Not implemented for Saleor");
  }

  async cashfreeCheckout(params: any) {
    throw new Error("Not implemented for Saleor");
  }

  async razorpayCheckout(params: any) {
    throw new Error("Not implemented for Saleor");
  }

  async stripeCheckout(params: any) {
    throw new Error("Not implemented for Saleor");
  }

  async razorCapture(params: any) {
    throw new Error("Not implemented for Saleor");
  }

  async listPublic() {
    throw new Error("Not implemented for Saleor");
  }

  async getOrderByEmailAndOTP(params: any) {
    throw new Error("Not implemented for Saleor");
  }

  async buyAgain() {
    throw new Error("Not implemented for Saleor");
  }

  async submitReview(params: any) {
    throw new Error("Not implemented for Saleor");
  }
}

// Use singleton instance
export const orderService = OrderService.getInstance()
