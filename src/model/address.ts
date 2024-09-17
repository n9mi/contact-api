import { Address } from "@prisma/client";

export interface AddressRequest {
    street?: string,
    city?: string,
    province?: string,
    country: string,
    postal_code: string,
    contact_id: number
}

export interface AddressResponse {
    id: number,
    street?: string,
    city?: string,
    province?: string,
    country: string,
    postal_code: string,
}

export function toAddressResponse(address: Address): AddressResponse {
    return {
        id: address.id,
        street: address.street ?? "", 
        city: address.city ?? "",
        province: address.province ?? "",
        country: address.country,
        postal_code: address.postal_code
    }
}