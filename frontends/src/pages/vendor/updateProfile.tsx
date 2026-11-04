import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard"
import { FormLayout } from "@/components/layout/formLayout";
import { userApi } from "@/services/userApi";
import { User, LoggedInUser } from "@/types/user";
import ProfileForm from "@/components/profileForm";

export default function UpdateVendorProfile() {
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
                setError("User ID unavailable");
                return null;
            }

            return id;
        } catch {
            setError("Session invalid");
            return null;
        }
    };

    useEffect(() => {
        loadUser();
    }, []);
    
    const loadUser = async () => {
        setError("");
        const id = getLoggedInUserId();
        if (!id) {
            return;
        }

        try {
            const freshUser = await userApi.getUserById(id);
            setFormData({
                firstName: freshUser.firstName ?? "",
                lastName: freshUser.lastName ?? "",
                phoneNumber: freshUser.phoneNumber ?? "",
                email: freshUser.email,
                role: freshUser.role,
            });
        } catch (err) {
            setError("Failed to load user");
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

    const profileFields: { label: string; name: keyof User; value: string }[] = [
        { label: "First Name", name: "firstName", value: formData.firstName ?? "" },
        { label: "Last Name", name: "lastName", value: formData.lastName ?? "" },
        { label: "Phone Number", name: "phoneNumber", value: formData.phoneNumber ?? "" },
        { label: "Email", name: "email", value: formData.email ?? "" },
    ];


    return (
        <FormLayout>
            <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>

            <div className="w-full max-w-md my-4">
                <Link
                    href="/vendor"
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
                >
                    Back to home page
                </Link>
            </div>

            <ProfileForm
                profileFields={profileFields}
                formData={formData}
                onChange={handleInputChange}
                onSave={handleSave}
                saved={saved}
                error={error}
            />
        </FormLayout>
    );
}