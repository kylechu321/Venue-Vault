export interface Admin {
    id: number;
    username: string;
    password?: string;
}

export interface AdminLoginFormData {
    username: string;
    password: string;
}

export type LoggedInAdmin = {
    id?: string | number;
    username?: string;
    role: "admin";
};

export interface IdCounters {
    vendor: number;
    venue: number;
    booking: number;
    application: number;
    applicant: number;
}