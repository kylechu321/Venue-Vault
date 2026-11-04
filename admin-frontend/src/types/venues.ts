import { VendorBasic } from './vendorSharedTypeWithVenues';

export interface Venue {
    id: number;
    vendorId: number;
    venueName: string;
    description: string;
    location: string;
    capacity: number;
    suitability: string;
    featured: number;
    vendor?: VendorBasic;
}

export interface CreateVenueArgs {
    vendorId: number;
    venueName: string;
    description: string;
    location: string;
    capacity: number;
    suitability: string;
    featured: number;
}

export interface UpdateVenueArgs {
    id: number;
    vendorId?: number;
    venueName?: string;
    description?: string;
    location?: string;
    capacity?: number;
    suitability?: string;
    featured?: number;
}