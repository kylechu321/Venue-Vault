import React from "react";
import { User } from "@/types/user";

type Field = { label: string; name: keyof User; value: string };

type ProfileField = {
    profileFields: Field[];
    formData: Partial<User>;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    saved: boolean;
    error: string;
};

export default function ProfileForm({ profileFields, onChange, onSave, saved, error }: ProfileField) {
    return (
        <>
            {error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : (
                <>
                    {saved && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            Profile updated successfully!
                        </div>
                    )}

                    <ul className="space-y-4">
                        {profileFields.map((field) => (
                            <li key={field.name as string}>
                                <label className="block text-sm font-medium mb-1">{field.label}</label>
                                <input
                                    type="text"
                                    name={field.name as string}
                                    value={field.value}
                                    onChange={onChange}
                                    readOnly={field.name === "email"}
                                    className="w-full rounded-md border-2 border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={onSave}
                        className="mt-6 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Save Changes
                    </button>
                </>
            )}
        </>
    );
}
