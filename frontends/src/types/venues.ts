export type Venue = {
    id: number;
    name: string;
    location: string;
    capacity: number;
    suitability: string;
};

export type VenueBackend ={
    id: number;
    vendorId: number;
    venueName: string;
    description: string;
    location: string;
    capacity: number;
    suitability: string;
}

export type BlockedVenue = {
    venueId: number;
    venueName: string;
    startDate: string;
    endDate: string;
};

export type VendorRecord = {
    id: number;
    userID: number;
};

export type VenueRecord = {
    id: number;
    venueName?: string;
    vendorId: number;
};