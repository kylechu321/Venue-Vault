import axios from "axios";
import { User } from "@/types/user"

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
});

export const userApi = {
    login: async (email: string, password: string): Promise<User> => {
        const response = await api.post<User>("/users/login", { email, password });
        return response.data;
    },
    getAllUsers: async (): Promise<User[]> => {
        const response = await api.get<User[]>("/users");
        return response.data;
    },
    getUserById: async (id: number): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },
    createUser: async (user: Partial<User>): Promise<User> => {
        const response = await api.post<User>("/users", user);
        return response.data;
    },
    updateUser: async (id: number, user: Partial<User>): Promise<User> => {
        const response = await api.put<User>(`/users/${id}`, user);
        return response.data;
    },
    deleteUser: async (id: number): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};