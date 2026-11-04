export interface VenueBasic {
    id: number;
    name: string;
    address: string;
    capacity: number;
    pricePerHour: number;
    vendorId: number;
    featured: boolean;
    category: string;
    description: string;
}

export interface VendorBasic {
    id: number;
    name: string;
    email: string;
    phone: string;
    createdAt: string;
}