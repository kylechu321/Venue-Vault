import { BackendApplication } from "@/services/venueApplicationApi";

export type HireStatus = "completed" | "cancelled" | "in-progress";

export type PostStatus = "approved" | "pending" | "rejected";

export type Post = {
    id: string | number;
    venue?: string;
    venueId?: number;
    eventName?: string;
    hirerId?: string | number;
    hirerUsername?: string;
    numGuests?: number;
    eventDate?: string;
    eventTime?: string;
    eventDuration?: number;
    hireDateStart?: string;
    hireDateEnd?: string;
    hours?: number;
    createdAt?: string;
    status?: PostStatus;
    comment?: string;
    pending?: number;
};

export const mapPendingToStatus = (pending: number | null | undefined): PostStatus => {
    if (pending === 1) {
        return "approved";
    }

    if (pending === 0) {
        return "rejected";
    }

    return "pending";
};

export const transformApplication = (
    application: BackendApplication,
    venueName: string,
    hirerUsername: string
): Post => {
    return {
        id: application.id,
        venue: venueName,
        eventName: application.eventName,
        numGuests: application.guestNum,
        eventDate: application.hireDate,
        eventTime: application.startTime,
        eventDuration: application.hours,
        hirerId: application.hirerId,
        venueId: application.venueId,
        hirerUsername: hirerUsername,
        createdAt: application.hireDate,
        status: mapPendingToStatus(application.pending),
        comment: application.comment,
        pending: application.pending ?? undefined,
    };
};

export type ComplianceDocument = {
    id: string;
    hirerId: string;
    name: string;
    type: "insurance" | "license" | "certification" | "other";
    uploadedDate: string;
    fileUrl?: string;
    expiryDate: string;
    verified: boolean;
};



export type HireRecord = {
    id: string;
    hirerId: string;
    vendorName: string;
    venueName: string;
    eventName: string;
    eventDate: string;
    status: HireStatus;
    rating?: number;
};