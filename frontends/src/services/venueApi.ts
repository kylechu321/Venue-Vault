import axios from "axios";
import { VenueBackend } from "@/types/venues"

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

export const venueApi = {
    getAllVenues: async (): Promise<VenueBackend[]> => {
        const response = await api.get<VenueBackend[]>("/venues");
        return response.data;
    },
    getVenueById: async (id: number): Promise<VenueBackend> => {
        const response = await api.get<VenueBackend>(`/venues/${id}`);
        return response.data;
    },
    getVenueByLocation: async (location: string): Promise<VenueBackend[]> => {
        const response = await api.get<VenueBackend[]>(`/venues?location=${location}`);
        return response.data;
    },
    getVenueBySuitability: async (suitability: string): Promise<VenueBackend[]> => {
        const response = await api.get<VenueBackend[]>(`/venues?suitability=${suitability}`);
        return response.data;
    },
    getVenueByCapacity: async (capacity: number): Promise<VenueBackend[]> => {
        const response = await api.get<VenueBackend[]>(`/venues?capacity=${capacity}`);
        return response.data;
    },
    getVenueByVendorId: async (vendorId: number): Promise<VenueBackend[]> => {
        const response = await api.get<VenueBackend[]>(`/venues/vendor/${vendorId}`);
        return response.data;
    },
    getFeaturedVenues: async (): Promise<VenueBackend[]> => {
        const response = await api.get<VenueBackend[]>("/venues/featured");
        return response.data;
    },
};