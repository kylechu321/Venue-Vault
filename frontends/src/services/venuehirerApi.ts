import axios from "axios";
import { HirerChartStat, HirerStat } from "@/types/venueHirerStats";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

export const venueHirerStatsAPI = {
    getHirerStats: async (): Promise<HirerStat[]> => {
        const response = await api.get<HirerStat[]>("/venueHirerStats");
        return response.data;
    },
    getHirerChartStats: async (): Promise<HirerChartStat[]> => {
        const response = await api.get<HirerChartStat[]>("/venueHirerStats/charts");
        return response.data;
    },
    getHirerRatings: async (hirerId: number): Promise<number> => {
        try {
            const response = await api.get<{ averageRating: number }>(`/venueHirerStats/${hirerId}/ratings`);
            return response.data.averageRating;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return 0;
            }
            throw error;
        }
    },

};

