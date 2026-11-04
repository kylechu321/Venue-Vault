export interface HirerInfo {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface PopularVenueReport {
    rank: number;
    venue: {
        id: number;
        venueName: string;
        location: string;
        capacity: number;
        suitability: string;
        featured: number;
        vendorId: number;
        description: string;
    };
    totalBookings: number;
    mostPopularDay: string;
    mostPopularTimeSlot: string;
}

export interface ActiveApplicantReport {
    rank: number;
    hirer: HirerInfo;
    successfulBookings: number;
    totalApplications: number;
    successRate: string;
}