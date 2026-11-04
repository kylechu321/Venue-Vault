import axios from "axios";
import { Post } from "@/types/application";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
});
export interface BackendApplication {
    id: number | string;
    venue?: string;
    venueId?: number;
    hirerId?: number | string;
    eventName?: string;
    guestNum?: number;
    hireDate?: string;
    startTime?: string;
    hours?: number;
    comment?: string;
    pending?: number | null;
    [key: string]: any;
}

export const venueApplicationApi = {
    getAllVenueApplications: async (): Promise<Post[]> => {
        const response = await api.get("/venueApplications");
        return response.data;
    },

    getVenueApplicationByHirerId: async (hirerId: number | string): Promise<Post> => {
        const response = await api.get(`/venueApplications/${hirerId}`);
        return response.data;
    },
    createVenueApplication: async (venueApplication: Omit<Post, "id">): Promise<Post> => {
        const response = await api.post("/venueApplications", venueApplication);
        return response.data;
    },

    updateVenueApplication: async (id: number | string, venueApplication: Omit<Post, "id">): Promise<Post> => {
        const response = await api.put(`/venueApplications/${id}`, venueApplication);
        return response.data;
    },

    updateVenueApplicationPending: async (
        id: number | string,
        payload: { pending: number; comment?: string }
    ): Promise<Post> => {
        const response = await api.put(`/venueApplications/${id}/pending`, payload);
        return response.data;
    },

    getVenueApplicationsByVenueId: async (venueId: number | string): Promise<Post[]> => {
        const response = await api.get(`/venueApplications?venueId=${venueId}`);
        return response.data;
    }
};