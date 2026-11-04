import axios from "axios";
import { VenuePreferenceBackend } from "@/types/preferences";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

export const venuePreferenceApi = {
    getVenuePreferencesById: async (hirerId: number | string): Promise<VenuePreferenceBackend[]> => {
        const response = await api.get(`/venuePreferences/${hirerId}`);
        return response.data;
    },
    getVenuePreferencesByHirerId: async (hirerId: number | string): Promise<VenuePreferenceBackend[]> => {
        const response = await api.get(`/venuePreferences?hirerId=${hirerId}`);
        return response.data;
    },
    createVenuePreference: async (venuePreference: Omit<VenuePreferenceBackend, "id">): Promise<VenuePreferenceBackend> => {
        const response = await api.post("/venuePreferences", venuePreference);
        return response.data;
    },
    updateVenuePreference: async (id: number | string, venuePreference: Omit<VenuePreferenceBackend, "id">): Promise<VenuePreferenceBackend> => {
        const response = await api.put(`/venuePreferences/${id}`, venuePreference);
        return response.data;
    },
    deleteVenuePreference: async (id: number | string): Promise<void> => {
        await api.delete(`/venuePreferences/${id}`);
    },
    deleteVenuePreferencesById: async (hirerId: number | string): Promise<void> => {
        await api.delete(`/venuePreferences/${hirerId}`);
    },
};