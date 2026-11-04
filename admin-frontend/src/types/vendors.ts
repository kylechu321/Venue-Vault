import { VenueBasic } from './vendorSharedTypeWithVenues';

export interface Vendor {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}

export interface VendorWithVenues extends Vendor {
    venues: VenueBasic[];
}

export interface VendorIdArg {
    id: number;
}

export interface CreateVendorArgs {
    name: string;
    email: string;
    phone: string;
}

export interface UpdateVendorArgs {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
}