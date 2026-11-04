import { useEffect, useState } from "react";
import { userApi } from "@/services/userApi";
import { hirerApi } from "@/services/hirerApi";
import { User } from "@/types/user";
import { Hirer } from "@/types/hirer";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { LayOut } from "@/components/layout/layOut";
import {
    StarRating,
    CredibilityScore,
} from "@/components/shareProfileComponents/profileComponent";
import { venueHirerStatsAPI } from "@/services/venuehirerApi";

export default function HirerProfile() {
    UseWebAuthGuard();
    const [hirer, setHirer] = useState<User | null>(null);
    const [hirerDocs, setHirerDocs] = useState<Hirer | null>(null);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"history" | "documents">("history");
    // Fetch hirer profile
    useEffect(() => {
        const fetchProfile = async () => {
            const stored = localStorage.getItem("loggedInUser");
            if (!stored) {
                return;
            }
            try {
                const session = JSON.parse(stored);
                const freshUser = await userApi.getUserById(session.id);
                setHirer(freshUser);
                const hirerData = await hirerApi.getHirerByUserID(Number(session.id));
                if (hirerData) {
                    setHirerDocs(hirerData);
                }
                try {
                    const statId = hirerData?.id;
                    if (!statId) {
                        setRating(0);
                        return;
                    }

                    const averageRating = await venueHirerStatsAPI.getHirerRatings(statId);
                    setRating(averageRating ?? 0);
                } catch (ratingError) {
                    console.error("Failed to load rating", ratingError);
                    setRating(0);
                }

            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <LayOut>
                <p className="text-gray-600">Loading profile...</p>
            </LayOut>
        );
    }
    // Calculate credibility score
    const uploadedDocCount = [
        hirerDocs?.driverLicenseDoc,
        hirerDocs?.insuranceDoc,
        hirerDocs?.registrationDoc,
    ].filter(Boolean).length;

    const credibilityScore = (uploadedDocCount / 3) * 100;
    // Render documents
    const renderDocument = (label: string, value: string | undefined) => {
        if (!value) {
            return (
                <div key={label} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                    <p className="text-xs text-gray-400 italic">Not uploaded</p>
                </div>
            );
        }

        const isImage = value.startsWith("data:image");
        const isPdf = value.startsWith("data:application/pdf");

        return (
            <div key={label} className="border border-gray-200 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
                {isImage && (
                    <img
                        src={value}
                        alt={label}
                        className="w-full max-h-48 object-contain rounded border border-gray-200"
                    />
                )}
                {isPdf && (
                    <a
                        href={value}
                        download={`${label}.pdf`}
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1 rounded"
                    >
                        Download PDF
                    </a>
                )}
                {!isImage && !isPdf && (
                    <p className="text-xs text-gray-500">File uploaded</p>
                )}
            </div>
        );
    };

    return (
        <LayOut>
            <div className="items-center text-gray-900">
                <div className="mb-4">
                    <Link href="/hirer" className="text-blue-700 underline text-sm hover:text-blue-800">
                        ← Back Home
                    </Link>
                </div>

                <CredibilityScore score={credibilityScore} />

                <div className="mb-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">
                                {hirer ? `${hirer.firstName} ${hirer.lastName}` : "Hirer Profile"}
                            </h1>
                            {hirer && <p className="text-gray-500 text-sm">{hirer.email}</p>}
                        </div>
                        <Link
                            href="/hirer/updateProfile"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    <div className="mb-6 space-y-2 text-sm text-gray-800">
                        <p><span className="text-gray-600">Phone:</span> {hirer?.phoneNumber}</p>
                        <p>
                            <span className="text-gray-600">Member Since:</span>{" "}
                            {hirer?.createdAt ? new Date(hirer.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold">{rating.toFixed(1)}</p>
                            <StarRating rating={Math.round(rating)} />
                            <p className="text-xs text-gray-500 mt-1">Rating</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{uploadedDocCount}</p>
                            <p className="text-xs text-gray-500 mt-1">Docs Uploaded</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold">{3 - uploadedDocCount}</p>
                            <p className="text-xs text-gray-500 mt-1">Docs Missing</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 rounded font-medium text-sm ${activeTab === "history" ? "bg-blue-500 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                    >
                        Hire History
                    </button>
                    <button
                        onClick={() => setActiveTab("documents")}
                        className={`px-4 py-2 rounded font-medium text-sm ${activeTab === "documents" ? "bg-blue-500 text-white" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"}`}
                    >
                        Compliance Documents
                    </button>
                </div>

                {activeTab === "history" && (
                    <div className="space-y-3">
                        <p className="text-gray-500 text-sm">No hire history found.</p>
                    </div>
                )}

                {activeTab === "documents" && (
                    <div className="space-y-4">
                        <Link
                            href="/hirer/uploadComplianceDocs"
                            className="mb-4 inline-block rounded bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                        >
                            Upload or Edit Documents
                        </Link>
                        {renderDocument("Driver License", hirerDocs?.driverLicenseDoc)}
                        {renderDocument("Insurance", hirerDocs?.insuranceDoc)}
                        {renderDocument("Registration", hirerDocs?.registrationDoc)}
                    </div>
                )}
            </div>
        </LayOut>
    );
}