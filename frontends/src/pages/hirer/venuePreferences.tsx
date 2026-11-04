import { useState, useEffect } from "react";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { LayOut } from "@/components/layout/layOut";
import { User } from "@/types/user";
import { VenueBackend } from "@/types/venues";
import {
    isValidPreferenceRanking,
    VenuePreferenceBackend
} from "@/types/preferences";
import { venueApi } from "@/services/venueApi";
import { hirerApi } from "@/services/hirerApi";
import { venuePreferenceApi } from "@/services/venuePreferenceApi";

type PreferenceInputMap = Record<number, string>;

export default function VenuePreferences() {
    //check for link pasting for not logged in user
    UseWebAuthGuard();

    const [venues, setVenues] = useState<VenueBackend[]>([]);
    const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
    const [hirerId, setHirerId] = useState<number | null>(null);
    const [preferences, setPreferences] = useState<PreferenceInputMap>({});
    const [saveMessage, setSaveMessage] = useState("");
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");

        if (!storedUser) {
            setIsLoading(false);
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser) as User;
            setLoggedInUser(parsedUser);
        } catch (error) {
            console.error("Failed to fetch logged in user", error);
        }
    }, []);

    useEffect(() => {
        let mounted = true;

        // load venues and hirer preferences
        async function loadData() {
            try {
                const [venuesFromBackend, hirerFromBackend] = await Promise.all([
                    venueApi.getFeaturedVenues(),
                    loggedInUser ? hirerApi.getHirerByUserID(Number(loggedInUser.id)) : Promise.resolve(null),
                ]);

                if (!mounted) {
                    return;
                }

                setVenues(venuesFromBackend);

                if (hirerFromBackend?.id) {
                    setHirerId(hirerFromBackend.id);

                    const preferencesFromBackend = await venuePreferenceApi.getVenuePreferencesByHirerId(
                        hirerFromBackend.id
                    );

                    const loadedPreferences = preferencesFromBackend.reduce<PreferenceInputMap>((acc, preference) => {
                        acc[preference.venueId] = preference.ranking.toString();
                        return acc;
                    }, {});

                    if (mounted) {
                        setPreferences(loadedPreferences);
                    }
                }
            } catch (error) {
                console.error("Failed to load venue preferences data", error);
                if (mounted) {
                    setVenues([]);
                    setPreferences({});
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        if (!loggedInUser) {
            setIsLoading(false);
            return;
        }
        loadData();

        return () => {
            mounted = false;
        };
    }, [loggedInUser]);

    // handle preference change for a venue
    const handlePreferenceChange = (venueId: number, value: string) => {
        setSaveMessage("");

        setPreferences((currentPreferences) => {
            const updatedPreferences: PreferenceInputMap = { ...currentPreferences };

            if (value === "") {
                delete updatedPreferences[venueId];
                return updatedPreferences;
            }

            for (const [existingVenueId, existingRank] of Object.entries(updatedPreferences)) {
                if (existingRank === value && Number(existingVenueId) !== venueId) {
                    delete updatedPreferences[Number(existingVenueId)];
                }
            }

            updatedPreferences[venueId] = value;
            return updatedPreferences;
        });
    };

    // get rank options based on the number of venues
    const getRankOptions = () => {
        return Array.from({ length: venues.length }, (_, index) => index + 1);
    };

    const handleSavePreferences = async () => {
        if (!hirerId) {
            setSaveMessage("hirer profile found");
            setSaveStatus("error");
            return;
        }

        const rankOptions = getRankOptions();

        const normalizedPreferences = Object.entries(preferences)
            .map(([venueId, ranking]) => ({
                venueId: Number(venueId),
                ranking: Number(ranking),
            }))
            .filter(({ ranking }) => isValidPreferenceRanking(ranking, rankOptions.length));

        try {
            const existingPreferences = await venuePreferenceApi.getVenuePreferencesByHirerId(hirerId);

            const existingByVenueId = new Map<number, VenuePreferenceBackend>(
                existingPreferences.map((preference) => [preference.venueId, preference])
            );

            for (const { venueId, ranking } of normalizedPreferences) {
                const existingPreference = existingByVenueId.get(venueId);

                if (existingPreference) {
                    await venuePreferenceApi.updateVenuePreference(existingPreference.id, {
                        hirerId,
                        venueId,
                        ranking,
                    });
                } else {
                    await venuePreferenceApi.createVenuePreference({
                        hirerId,
                        venueId,
                        ranking,
                    });
                }
            }

            setSaveMessage("Venue preferences saved.");
            setSaveStatus("success");
        } catch (error) {
            console.error("Failed to save preferences", error);
            setSaveMessage("Could not save preferences to the server.");
            setSaveStatus("error");
        }
    };

    const rankedVenueSummaries = venues
        .filter((venue) => preferences[venue.id])
        .map((venue) => ({
            venue,
            ranking: Number(preferences[venue.id]),
        }))
        .sort((a, b) => a.ranking - b.ranking);

    return (
        <LayOut>
            <div className="w-full max-w-md my-4">
                <Link
                    href="/hirer"
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                >
                    Back to Home
                </Link>
            </div>

            <h2 className="text-xl font-semibold mb-4">My Venue Preferences</h2>
            {isLoading && <p className="mb-4 text-gray-600">Loading your venue preferences</p>}
            <div className="space-y-4">
                {venues.map((venue) => (
                    <div key={venue.id} className="bg-white p-10 rounded-lg shadow-md border border-gray-300">
                        <h3 className="text-lg font-semibold mb-2">{venue.venueName}</h3>
                        <p className="text-gray-600 mb-4">
                            <span className="font-medium">Location:</span> {venue.location}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <span className="font-medium">Capacity:</span> {venue.capacity}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <span className="font-medium">Suitability:</span> {venue.suitability}
                        </p>
                        <div className="flex flex-col gap-2">
                            <label htmlFor={`preference-${venue.id}`} className="font-medium text-black">
                                Preference rank (1 = top choice)
                            </label>
                            <select
                                id={`preference-${venue.id}`}
                                value={preferences[venue.id] ?? ""}
                                onChange={(event) => handlePreferenceChange(venue.id, event.target.value)}
                                className="rounded border border-gray-300 bg-white px-3 py-2 text-black"
                            >
                                <option value="">Not ranked</option>
                                {getRankOptions().map((rank) => (
                                    <option key={rank} value={rank.toString()}>
                                        {rank}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                {venues.length === 0 && (
                    <p className="text-gray-600">
                        No venues are available right now.
                    </p>
                )}
            </div>

            <div className="mt-6 flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                >
                    Save Preferences
                </button>
                {saveMessage && (
                    <p className={`text-sm ${saveStatus === "success" ? "text-green-600" : "text-red-600"}`}>
                        {saveMessage}
                    </p>
                )}
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">My Ranked Venues</h3>
                {rankedVenueSummaries.length === 0 ? (
                    <p className="text-gray-600">You have not ranked any venues yet.</p>
                ) : (
                    <ul className="space-y-2">
                        {rankedVenueSummaries.map(({ venue, ranking }) => (
                            <li key={venue.id} className="text-black">
                                #{ranking} - {venue.venueName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </LayOut>
    );
}