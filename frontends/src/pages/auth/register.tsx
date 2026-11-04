import React, { useState } from "react";
import Link from "next/link";
import {RegisterFormData, UserRole} from "@/types/user";
import { userApi } from "@/services/userApi";
import {SignAndSignOutLayout} from "@/components/layout/authenticationLayout";
import { inputChangeHandler } from "@/components/signInAndSignOutComponents/inputChangedComponents"
import {
    frontendEmailValidation,
    frontendPasswordValidation,
    frontendPhoneNumberValidation
} from "@/utils/frontendPasswordValidation";


//from week 3 example 4
export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
        role: "none",
    });

    //false until user press submit
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
    const [emailErrors, setEmailErrors] = useState<string[]>([]);
    const [phoneErrors, setPhoneErrors] = useState<string[]>([]);

    const handleInputChange = inputChangeHandler<RegisterFormData>(setFormData);

    // handle changes to radio buttons for role selection
    const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prevState) => ({
            ...prevState,
            role: e.target.value as UserRole,
        }));
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement> ) => {
        // We can prevent the default form submission behavior
        e.preventDefault();
        setError("");
        setConfirmPasswordError("");


        // let's check that the email ends with @rmit.edu.au
        const emailValidation = frontendEmailValidation(formData.email);
        if (!emailValidation.isValid) {
            setEmailErrors(emailValidation.errors);
            return;
        }
        setEmailErrors([]);

        const phoneValidation = frontendPhoneNumberValidation(formData.phoneNumber);
        if (!phoneValidation.isValid) {
            setPhoneErrors(phoneValidation.errors);
            return;
        }
        setPhoneErrors([]);

        // validate that a role has been selected
        if (formData.role === "none") {
            alert("Please select a role");
            return;
        }

        const pwValidation = frontendPasswordValidation(formData.password);
        if (!pwValidation.isValid) {
            setPasswordErrors(pwValidation.errors);
            return;
        }
        setPasswordErrors([]);

        if (formData.password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }

        try {
            await userApi.createUser(formData);
            console.log("Register form data:", formData);
            setSubmitted(true);
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    return (
        <SignAndSignOutLayout>
            <div className="flex flex-col items-center justify-center w-full flex-1 py-10">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Create a new account</h1>
                    {submitted ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <p>Thank you for registering</p>
                            <Link href="/" className="mt-2 text-sm underline">
                                Back to Home
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="w-full max-w-md my-4">
                                <Link href="/" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                                    Back to home page
                                </Link>
                            </div>

                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-white-700">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-white-700">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-white-700">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {phoneErrors.length > 0 && (
                                    <ul className="mt-1 text-sm text-red-500 list-disc list-inside">
                                        {phoneErrors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {emailErrors.length > 0 && (
                                    <ul className="mt-1 text-sm text-red-500 list-disc list-inside">
                                        {emailErrors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white-700">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {passwordErrors.length > 0 && (
                                    <ul className="mt-1 text-sm text-red-500 list-disc list-inside">
                                        {passwordErrors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-white-700">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        setConfirmPassword(event.target.value);
                                        if (confirmPasswordError) {
                                            setConfirmPasswordError("");
                                        }
                                    }}
                                    required
                                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {confirmPasswordError && (
                                    <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white-700 mb-2">
                                    I am registering as a:
                                </label>
                                <div className="flex gap-6">
                                    <label className="flex items-center gap-2 text-white-700">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="vendor"
                                            checked={formData.role === "vendor"}
                                            onChange={handleRoleChange}
                                        />
                                        Vendor
                                    </label>
                                    <label className="flex items-center gap-2 text-white-700">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="hirer"
                                            checked={formData.role === "hirer"}
                                            onChange={handleRoleChange}
                                        />
                                        Hirer
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-500">{error}</p>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </SignAndSignOutLayout>
    );
}

