import { LoggedInAdmin } from "@/types/admin";

const GRAPHQL_URL = "http://localhost:3001/graphql";

export const adminApi = {
    login: async (username: string, password: string): Promise<LoggedInAdmin> => {
        const response = await fetch(GRAPHQL_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
                    query AdminLogin($username: String!, $password: String!) {
                        adminLogin(username: $username, password: $password) {
                            id
                            username
                            role
                        }
                    }
                `,
                variables: { username, password },
            }),
        });

        const data = await response.json();

        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        return data.data.adminLogin;
    },
};