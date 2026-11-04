import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard"
import { FormLayout } from "@/components/layout/formLayout";
import { userApi } from "@/services/userApi";
import { User, LoggedInUser } from "@/types/user";
import ProfileForm from "@/components/profileForm";

export default function UpdateHirerProfile() {
    //check for link pasting for not logged in user
    UseWebAuthGuard();
    const [formData, setFormData] = useState<Partial<User>>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        role: "none",
    });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const getLoggedInUserId = (): number | null => {
        const storedSession = localStorage.getItem("loggedInUser");
        if (!storedSession) {
            setError("No logged-in user found.");
            return null;
        }

        try {
            const session = JSON.parse(storedSession) as LoggedInUser;
            const id = session.id ? Number(session.id) : NaN;

            if (!id) {
                setError("User id not available in session.");
                return null;
            }

            return id;
        } catch {
            setError("Session is invalid.");
            return null;
        }
    };

    useEffect(() => {
        loadUser();
    }, []);

    // 
    const loadUser = async () => {
        setError("");
        const id = getLoggedInUserId();
        if (!id) {
            return;
        }

        try {
            const user = await userApi.getUserById(id);
            setFormData({
                firstName: user.firstName ?? "",
                lastName: user.lastName ?? "",
                phoneNumber: user.phoneNumber ?? "",
                email: user.email,
                role: user.role,
            });
        } catch (err) {
            setError("Unable to load user");
        }
    };

    // handle input change for all fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    // only send fields that are allowed to be updated
    const handleSave = async () => {
        setError("");
        const id = getLoggedInUserId();
        if (!id) {
            return;
        }
        try {
            const updated = await userApi.updateUser(id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: formData.phoneNumber,
            });
            // update session storage with fresh info
            localStorage.setItem("loggedInUser", JSON.stringify({
                id: updated.id,
                firstName: updated.firstName,
                lastName: updated.lastName,
                role: updated.role,
            }));

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError("Failed to update profile on backend.");
        }
    };
    const profile: { label: string; name: keyof User; value: string }[] = [
        { label: "First Name", name: "firstName", value: formData.firstName ?? "" },
        { label: "Last Name", name: "lastName", value: formData.lastName ?? "" },
        { label: "Phone Number", name: "phoneNumber", value: formData.phoneNumber ?? "" },
        { label: "Email", name: "email", value: formData.email ?? "" },
    ];


    return (
        <FormLayout>
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

                <div className="w-full max-w-md my-4">
                    <Link
                        href="/hirer/profile"
                        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Back to profile
                    </Link>
                </div>

                <ProfileForm
                    profileFields={profile}
                    formData={formData}
                    onChange={handleInputChange}
                    onSave={handleSave}
                    saved={saved}
                    error={error}
                />
            </div>
        </FormLayout>
    );
}