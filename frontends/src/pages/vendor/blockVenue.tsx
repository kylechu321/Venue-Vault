import { useState, useEffect } from "react";
import { BlockedVenue, VenueBackend, VendorRecord } from "@/types/venues";
import { LoggedInUser } from "@/types/user";
import Link from "next/link";
import { LayOut } from "@/components/layout/layOut";
import { api, venueApi } from "@/services/venueApi";

export default function BlockVenue() {
    const [blockedVenues, setBlockedVenues] = useState<Array<BlockedVenue & { id?: number }>>([]);
    const [venues, setVenues] = useState<VenueBackend[]>([]);
    const [selectedVenueId, setSelectedVenueId] = useState<number | "">("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Helper function to get the logged-in user from localStorage
    const getLoggedInUser = (): LoggedInUser | null => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (!storedUser) return null;
        try {
            return JSON.parse(storedUser) as LoggedInUser;
        } catch (error) {
            console.error("Failed to parse logged in user", error);
            return null;
        }
    };

    useEffect(() => {
        load();
    }, []);

    // Load vendor-specific venues and blocked periods from backend
    const load = async () => {
        try {
            const loggedInUser = getLoggedInUser();
            if (!loggedInUser?.id) {
                setError("No logged-in user found");
                return;
            }

            const currentUserId = Number(loggedInUser.id);
            const vendorsResp = await api.get<VendorRecord[]>('/vendors');
            const vendors = Array.isArray(vendorsResp.data) ? vendorsResp.data : [];
            const vendor = vendors.find((v) => v.userID === currentUserId);

            if (!vendor) {
                setError("No vendor profile found for current user");
                return;
            }

            const vendorVenues = await venueApi.getVenueByVendorId(vendor.id);
            setVenues(vendorVenues);

            const resp = await api.get("/venueBlockedPeriods");
            const backendBlocks: Array<{ id: number; venueId: number; startDate: string; endDate: string }> = resp.data;

            const vendorVenueIds = new Set(vendorVenues.map((v) => v.id));
            const filtered = backendBlocks.filter((b) => vendorVenueIds.has(b.venueId));

            const mapped = filtered.map(b => {
                const v = vendorVenues.find(f => f.id === b.venueId);
                return {
                    id: b.id,
                    venueId: b.venueId,
                    venueName: v?.venueName || String(b.venueId),
                    startDate: b.startDate?.toString().slice(0, 10) ?? "",
                    endDate: b.endDate?.toString().slice(0, 10) ?? ""
                } as BlockedVenue & { id?: number };
            });

            setBlockedVenues(mapped);
        } catch (err) {
            console.error("Failed to load vendor venues or blocked periods", err);
            setError("Failed to load vendor data");
        }
    };


    // Validates the input and adds a new blocked venue to the list
    const handleBlock = async () => {
        setError("");
        setSuccess("");

        if (selectedVenueId === "") {
            setError("Please select a venue.");
            return;
        }
        if (!startDate || !endDate) {
            setError("Please select both a start and end date.");
            return;
        }
        if (new Date(endDate) < new Date(startDate)) {
            setError("End date cannot be before start date.");
            return;
        }

        // Prevent blocking a venue for today or any past date
        const today = new Date();
        const start = new Date(startDate);
        if (start <= today) {
            setError("Start date must be in the future (cannot be today or earlier).");
            return;
        }

        try {
            const resp = await api.post("/venueBlockedPeriods", {
                venueId: Number(selectedVenueId),
                startDate,
                endDate
            });
            const saved = resp.data;

            const venue = venues.find((v) => v.id === saved.venueId);
            const newBlock: BlockedVenue & { id?: number } = {
                id: saved.id,
                venueId: saved.venueId,
                venueName: venue?.venueName || venue?.venueName || String(saved.venueId),
                startDate: saved.startDate?.toString().slice(0, 10) ?? startDate,
                endDate: saved.endDate?.toString().slice(0, 10) ?? endDate,
            };

            setBlockedVenues((prev) => [...prev, newBlock]);

            setSelectedVenueId("");
            setStartDate("");
            setEndDate("");
            setSuccess(`"${newBlock.venueName}" has been blocked successfully.`);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to block venue");
        }
    };

    const handleUnblock = async (index: number) => {
        const block = blockedVenues[index];
        try {
            if (block.id) {
                await api.delete(`/venueBlockedPeriods/${block.id}`);
            }
            const updated = blockedVenues.filter((_, i) => i !== index);
            setBlockedVenues(updated);
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || "Failed to remove blocked period");
        }
    };

    return (
        <LayOut>
            <main className="max-w-2xl mx-auto px-6 py-10">
                <div className="mb-6">
                    <Link href="/vendor" className="text-sm text-blue-400 hover:text-blue-300">
                        ← Back to Vendor Home
                    </Link>
                </div>

                <h1 className="text-3xl font-extralight tracking-tight mb-8">Manage Blocked Venues</h1>

                <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Block a Venue</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Venue</label>
                        <select
                            value={selectedVenueId}
                            onChange={(e) =>
                                setSelectedVenueId(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded px-3 py-2"
                        >
                            <option value="">-- Select a venue --</option>
                            {venues.map((venue: VenueBackend) => (
                                <option key={venue.id} value={venue.id}>
                                    {venue.venueName} — {venue.location}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded px-3 py-2"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded px-3 py-2"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                    {success && <p className="text-green-400 text-sm mb-4">{success}</p>}

                    <button
                        type="button"
                        onClick={handleBlock}
                        className="bg-red-700 hover:bg-red-800 text-white text-sm font-medium py-2 px-4 rounded"
                    >
                        Block Venue
                    </button>
                </div>

                <div>
                    <h2 className="text-lg font-semibold mb-4">Currently Blocked Venues</h2>
                    {blockedVenues.length === 0 ? (
                        <p className="text-gray-500 text-sm">No venues are currently blocked.</p>
                    ) : (
                        <div className="space-y-3">
                            {blockedVenues.map((block, index) => (
                                <div
                                    key={index}
                                    className="bg-gray-100 border border-gray-300 rounded-lg p-4 flex items-center justify-between"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">{block.venueName}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {new Date(block.startDate).toLocaleDateString()} —{" "}
                                            {new Date(block.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleUnblock(index)}
                                        className="bg-gray-400 hover:bg-gray-500 text-white text-sm font-medium py-1 px-3 rounded"
                                    >
                                        Unblock
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </LayOut>
    );
}