import { useEffect, useState } from "react";
import { hirerApi } from "@/services/hirerApi";
import { userApi } from "@/services/userApi";
import { User } from "@/types/user";
import { Hirer } from "@/types/hirer";
import Link from "next/link";
import { useRouter } from "next/router";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { LayOut } from "@/components/layout/layOut";
import {
    StarRating,
    CredibilityScore,
} from "@/components/shareProfileComponents/profileComponent";
import { venueHirerStatsAPI } from "@/services/venuehirerApi";

export default function VendorSideViewHirerAccountView() {
    UseWebAuthGuard();
    const router = useRouter();
    const [hirer, setHirer] = useState<User | null>(null);
    const [hirerDocs, setHirerDocs] = useState<Hirer | null>(null);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        const selectedHirerId = Number(router.query.hirerId);
        if (!selectedHirerId) {
            setLoading(false);
            return;
        }

        const fetchHirer = async () => {
            try {
                const hirerData = await hirerApi.getHirerById(selectedHirerId);
                setHirerDocs(hirerData);

                const userId = Number(hirerData.userID);
                if (userId) {
                    const freshUser = await userApi.getUserById(userId);
                    setHirer(freshUser);
                } else {
                    setHirer(null);
                }

                if (hirerData?.id) {
                    const averageRating = await venueHirerStatsAPI.getHirerRatings(hirerData.id);
                    setRating(averageRating ?? 0);
                } else {
                    setRating(0);
                }
            } catch (err) {
                console.error("Failed to load hirer profile", err);
                setRating(0);
            } finally {
                setLoading(false);
            }
        };

        fetchHirer();
    }, [router.isReady, router.query.hirerId]);

    if (loading) {
        return (
            <LayOut>
                <p className="text-gray-600">Loading...</p>
            </LayOut>
        );
    }

    const uploadedDocCount = [
        hirerDocs?.driverLicenseDoc,
        hirerDocs?.insuranceDoc,
        hirerDocs?.registrationDoc,
    ].filter(Boolean).length;

    const credibilityScore = (uploadedDocCount / 3) * 100;

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
                    <Link href="/vendor" className="text-blue-700 underline text-sm hover:text-blue-800">
                        ← Back to Vendor Home
                    </Link>
                </div>

                <CredibilityScore score={credibilityScore} />

                <div className="mb-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
                    <h1 className="text-2xl font-bold mb-1">
                        {hirer ? `${hirer.firstName} ${hirer.lastName}` : "Hirer Profile"}
                    </h1>
                    {hirer && <p className="text-gray-500 text-sm mb-4">{hirer.email}</p>}

                    <div className="mb-6 space-y-2 text-sm text-gray-800">
                        <p><span className="text-gray-600">Phone:</span> {hirer?.phoneNumber}</p>
                        <p><span className="text-gray-600">Role:</span> {hirer?.role}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
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

                <h2 className="text-lg font-medium text-gray-900 mb-4">Compliance Documents</h2>
                <div className="space-y-4">
                    {renderDocument("Driver License", hirerDocs?.driverLicenseDoc)}
                    {renderDocument("Insurance", hirerDocs?.insuranceDoc)}
                    {renderDocument("Registration", hirerDocs?.registrationDoc)}
                </div>
            </div>
        </LayOut>
    );
}