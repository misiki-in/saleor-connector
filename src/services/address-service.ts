import type { Address } from '../types/address-types'
import type { PaginatedResponse } from '../types/pagination-types'
import { BaseService } from './base.service'

/**
 * Parameters for listing addresses with pagination and filtering
 */
interface ListAddressesParams {
  page?: number
  q?: string
  sort?: string
  user?: string
}

type CreateAddressParams = Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'active'>
type UpdateAddressParams = Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>

const ADDRESS_FRAGMENT = `
  fragment AddressDetails on Address {
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
    isDefaultShippingAddress
  }
`;

const GET_ADDRESSES = `
  ${ADDRESS_FRAGMENT}
  query GetAddresses {
    me {
      id
      addresses {
        ...AddressDetails
      }
    }
  }
`;

const ADDRESS_CREATE = `
  ${ADDRESS_FRAGMENT}
  mutation AccountAddressCreate($input: AddressInput!) {
    accountAddressCreate(input: $input) {
      address {
        ...AddressDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const ADDRESS_UPDATE = `
  ${ADDRESS_FRAGMENT}
  mutation AccountAddressUpdate($id: ID!, $input: AddressInput!) {
    accountAddressUpdate(id: $id, input: $input) {
      address {
        ...AddressDetails
      }
      errors {
        field
        message
      }
    }
  }
`;

const ADDRESS_DELETE = `
  mutation AccountAddressDelete($id: ID!) {
    accountAddressDelete(id: $id) {
      errors {
        field
        message
      }
    }
  }
`;

function mapSaleorAddress(node: any, userId?: string): Address {
  if (!node) return {} as Address;
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
    isPrimary: node.isDefaultShippingAddress || false,
    isResidential: false,
    lastName: node.lastName || null,
    lat: null,
    lng: null,
    locality: null,
    phone: node.phone || null,
    state: node.countryArea || null,
    userId: userId || null,
    zip: node.postalCode || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    countryCode: node.country?.code || null
  };
}

function handleErrors(errors?: any[]) {
  if (errors && errors.length > 0) {
    throw new Error(errors.map(e => e.message).join(', '));
  }
}

function formatPhone(phone?: string | null): string {
  if (!phone) return "";
  if (!phone.startsWith('+') && phone.replace(/\D/g, '').length === 10) {
    return `+91${phone.replace(/\D/g, '')}`;
  }
  return phone;
}

export class AddressService extends BaseService {
  private static instance: AddressService

  static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService()
    }
    return AddressService.instance
  }

  async list(params: ListAddressesParams = {}): Promise<PaginatedResponse<Address>> {
    const res = await this.query<any>(GET_ADDRESSES);
    const addresses = res?.me?.addresses || [];
    const userId = res?.me?.id;
    
    const mapped = addresses.map((addr: any) => mapSaleorAddress(addr, userId));
    
    // Simulate pagination format since Saleor 'me { addresses }' isn't paginated natively
    return {
      data: mapped,
      count: mapped.length,
      pageSize: mapped.length,
      page: 1,
      noOfPage: 1
    };
  }

  async fetchAddress(id: string): Promise<Address> {
    const res = await this.query<any>(GET_ADDRESSES);
    const addresses = res?.me?.addresses || [];
    const userId = res?.me?.id;
    const address = addresses.find((addr: any) => addr.id === id);
    if (!address) {
      throw new Error(`Address with id ${id} not found`);
    }
    return mapSaleorAddress(address, userId);
  }

  async saveAddress(address: CreateAddressParams): Promise<Address> {
    const addressInput = {
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      streetAddress1: address.address_1 || "",
      streetAddress2: address.address_2 || "",
      city: address.city || "",
      countryArea: address.state || "",
      postalCode: address.zip || "",
      country: address.countryCode || "IN",
      phone: formatPhone(address.phone)
    };

    const res = await this.query<any>(ADDRESS_CREATE, { input: addressInput });
    handleErrors(res?.accountAddressCreate?.errors);
    return mapSaleorAddress(res?.accountAddressCreate?.address);
  }

  async editAddress(id: string, address: UpdateAddressParams): Promise<Address> {
    const addressInput: any = {};
    if (address.firstName !== undefined) addressInput.firstName = address.firstName;
    if (address.lastName !== undefined) addressInput.lastName = address.lastName;
    if (address.address_1 !== undefined) addressInput.streetAddress1 = address.address_1;
    if (address.address_2 !== undefined) addressInput.streetAddress2 = address.address_2;
    if (address.city !== undefined) addressInput.city = address.city;
    if (address.state !== undefined) addressInput.countryArea = address.state;
    if (address.zip !== undefined) addressInput.postalCode = address.zip;
    if (address.countryCode !== undefined) addressInput.country = address.countryCode;
    if (address.phone !== undefined) addressInput.phone = formatPhone(address.phone);

    const res = await this.query<any>(ADDRESS_UPDATE, { id, input: addressInput });
    handleErrors(res?.accountAddressUpdate?.errors);
    return mapSaleorAddress(res?.accountAddressUpdate?.address);
  }

  async deleteAddress(id: string): Promise<void> {
    const res = await this.query<any>(ADDRESS_DELETE, { id });
    handleErrors(res?.accountAddressDelete?.errors);
  }
}

export const addressService = AddressService.getInstance()
