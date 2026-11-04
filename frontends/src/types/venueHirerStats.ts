
export type HirerStat = {
    id: number;
    hirerId: number;
    firstNameOfHirer: string;
    lastNameOfHirer: string;
    ratingOfTheHirer: number;
    approvalCount: number;
    totalCount: number;
};

export type VenueBreakdown = {
    venueName: string;
    approved: number;
    total: number;
};

export type HirerChartStat = {
    hirerId: number;
    hirerName: string;
    venueBreakdown: VenueBreakdown[];
    totalApproved: number;
    totalPending: number;
    totalCount: number;
};

export type ChartView = "perVenue" | "combined";