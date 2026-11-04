import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SignAndSignOutLayout } from "@/components/layout/authenticationLayout";
import {LoginFormData, UserRole} from "@/types/user";
import { userApi } from "@/services/userApi";
import { inputChangeHandler } from "@/components/signInAndSignOutComponents/inputChangedComponents";

export default function LoginPage() {
    const router = useRouter();
    const [loginData, setLoginData] = useState<LoginFormData>(
        {
            email: "",
            password: ""
        });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = inputChangeHandler<LoginFormData>(setLoginData);

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // call backend — user data comes from the database
            const user = await userApi.login(loginData.email, loginData.password);

            // store session info from the API response
            localStorage.setItem("loggedInUser", JSON.stringify(user));

            if (user.role === "vendor") await router.push("/vendor");
            else if (user.role === "hirer") await router.push("/hirer");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SignAndSignOutLayout>
            <div className="flex flex-col items-center justify-center w-full flex-1 py-10">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-white-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-white-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Sign In
                        </button>
                        <p className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="text-blue-500 underline">
                                Register here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </SignAndSignOutLayout>
    );


}