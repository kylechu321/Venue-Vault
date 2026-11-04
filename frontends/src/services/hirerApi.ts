import axios from "axios";
import { Hirer } from "../types/hirer"

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

export const hirerApi = {
    getAllHirers: async () => {
        const response = await api.get("/hirers");
        return response.data;
    },
    
    getHirerById: async (id: number) => {
        const response = await api.get(`/hirers/${id}`);
        return response.data;
    },
    getHirerByUserID: async (userID: number) => {
        const response = await api.get(`/hirers?userID=${userID}`);
        return response.data;
    },
    createHirer: async (hirer: Omit<Hirer, "id">) => {
        const response = await api.post("/hirers", hirer);
        return response.data;
    },

    updateHirer: async (id: number, hirer: Omit<Hirer, "id">) => {
        const response = await api.put(`/hirers/${id}`, hirer);
        return response.data;
    },

    updateComplianceDocs: async (id: number, hirer: Partial<Pick<Hirer, "driverLicenseDoc" | "insuranceDoc" | "registrationDoc">>) => {
        const response = await api.put(`/hirers/${id}/compliance-docs`, hirer);
        return response.data;
    },
    
    deleteHirer: async (id: number) => {
        const response = await api.delete(`/hirers/${id}`);
        return response.data;
    },
};
