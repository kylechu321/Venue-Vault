export type UserRole = "vendor" | "hirer" | "none";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: UserRole;
    rating?: number;
    createdAt?: string;
}

export interface RegisterFormData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    role: UserRole;
}

export interface LoginFormData {
    email: string;
    password: string;
}

export type LoggedInUser = {
    id?: string | number;
    firstName?: string;
    lastName?: string;
    role?: string;
};