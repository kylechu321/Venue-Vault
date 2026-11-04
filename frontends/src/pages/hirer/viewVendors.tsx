import {VenueBackend} from "@/types/venues";
import React, {useEffect, useMemo, useState} from "react";
import Link from "next/link";
import {UseWebAuthGuard} from "@/components/webAuthGuard";
import {DisplayLayout} from "@/components/layout/displayLayout";
import {venueApi} from "@/services/venueApi";

const getSearchableVenueFields = (venue: VenueBackend) => {
    return [
        venue.venueName,
        venue.description,
        venue.location,
        venue.capacity.toString(),
        venue.suitability,
    ];
};

export default function ViewVendors() {
    // Prevent direct URL access when not logged in.
    UseWebAuthGuard();

    const [venues, setVenues] = useState<VenueBackend[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loadError, setLoadError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadVenues = async (isActive: () => boolean) => {
        try {
            const fetchedVenues = await venueApi.getFeaturedVenues();

            if (!isActive()) return;

            setVenues(fetchedVenues);
            setLoadError(null);
        } catch (error) {
            if (!isActive()) return;

            console.error("Failed to fetch venues", error);
            setLoadError("Could not load venues from the database.");
            setVenues([]);
        } finally {
            if (!isActive()) return;

            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        loadVenues(() => isMounted);
        return () => {
            isMounted = false;
        };
    }, []);

    // Keep search logic close to where it is displayed.
    const venuesToDisplay = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) return venues;

        return venues.filter((venue) =>
            getSearchableVenueFields(venue)
                .filter(Boolean)
                .some((value) => value.toLowerCase().includes(query))
        );
    }, [searchTerm, venues]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    return (
        <DisplayLayout>
            <div className="w-full max-w-md my-4">
                <Link
                    href="/hirer"
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back to home page
                </Link>
            </div>

            <h2 className="text-xl font-semibold mb-4">Available Venues</h2>
            <div className="w-full max-w-md mb-4">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name, location, capacity, or suitability"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            {loadError && (
                <p className="text-red-400 mb-2">{loadError}</p>
            )}
            {isLoading && (
                <p className="text-gray-600 mb-2">Loading venues from the database...</p>
            )}
            <div className="space-y-4">
                {venuesToDisplay.map((venue) => (
                    <div key={venue.id} className="bg-white p-10 rounded-lg shadow-md border border-gray-300">
                        <h3 className="text-lg font-semibold mb-2">{venue.venueName}</h3>
                        <p className="text-gray-600 mb-4">
                            <span className="font-medium">Description:</span> {venue.description}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <span className="font-medium">Location:</span> {venue.location}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <span className="font-medium">Capacity:</span> {venue.capacity}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <span className="font-medium">Suitability:</span> {venue.suitability}
                        </p>
                    </div>
                ))}
                {venuesToDisplay.length === 0 && (
                    <p className="text-gray-600">
                        No venues found.
                    </p>
                )}
            </div>
        </DisplayLayout>
    );
}
