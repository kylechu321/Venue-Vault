import { useEffect, useState } from "react";
import { LayOut } from "@/components/layouts/layOut";
import Link from "next/link";
import { UseAdminAuthGuard } from "@/components/webAuthGuard";
import { venueManagementServices } from "@/service/managementAPI";

export default function ManageVendors() {
    UseAdminAuthGuard();
    const [vendors, setVendors] = useState<{ id: number; userID: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        venueManagementServices.getVendors()
            .then(setVendors)
            .catch(() => setError("Failed to load vendors"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <LayOut>
            <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <h1 className="text-3xl font-light tracking-tight text-gray-900">Manage Vendors</h1>
                <Link href="/dashboard" className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-gray-800 text-sm">
                    Back to Dashboard
                </Link>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {loading ? <p className="text-gray-500">Loading...</p> : (
                <div className="rounded-xl border border-gray-300 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Vendor ID</th>
                            <th className="px-4 py-3">User ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        {vendors.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-4 py-6 text-center text-gray-400">No vendors found</td>
                            </tr>
                        ) : vendors.map((vendor) => (
                            <tr key={vendor.id} className="border-t border-gray-200">
                                <td className="px-4 py-3 font-medium text-gray-900">#{vendor.id}</td>
                                <td className="px-4 py-3 text-gray-700">{vendor.userID}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </LayOut>
    );
}