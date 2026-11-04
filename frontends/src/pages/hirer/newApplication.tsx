import { Post, ComplianceDocument } from "@/types/application";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VenueBackend, BlockedVenue } from "@/types/venues";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { FormLayout } from "@/components/layout/formLayout";
import { venueApplicationApi } from "@/services/venueApplicationApi";
import { venueApi, api } from "@/services/venueApi";
import { hirerApi } from "@/services/hirerApi";



export default function NewApplication() {

    // stop users from opening this page if they are not signed in
    UseWebAuthGuard();
    const [venues, setVenues] = useState<VenueBackend[]>([]);
    const [blockedVenues, setBlockedVenues] = useState<BlockedVenue[]>([]);
    const [isLoadingVenues, setIsLoadingVenues] = useState(true);
    const [venueLoadError, setVenueLoadError] = useState<string | null>(null);



    const [formData, setFormData] = useState<Post>({
        id: "",
        venue: "",
        eventName: "",
        hirerId: "",
        hirerUsername: "",
        numGuests: 0,
        eventDate: "",
        eventTime: "",
        eventDuration: 0,
        createdAt: "",
        status: "pending",
        comment: "",
    });

    //false until user press submit
    const [submitted, setSubmitted] = useState(false);

    const fetchBlocked = async (isMounted: () => boolean) => {
        try {
            const resp = await api.get('/venueBlockedPeriods');
            const backendBlocks: Array<{ venueId: number; startDate: string; endDate: string }> = resp.data || [];

            if (!isMounted()) return;

            // Include venue names in the blocked periods
            const mapped: BlockedVenue[] = backendBlocks.map((b) => {
                const v = venues.find((vv) => vv.id === b.venueId);
                return {
                    venueId: b.venueId,
                    venueName: v?.venueName || String(b.venueId),
                    startDate: b.startDate?.toString().slice(0, 10) ?? "",
                    endDate: b.endDate?.toString().slice(0, 10) ?? "",
                } as BlockedVenue;
            });

            if (isMounted()) setBlockedVenues(mapped);
        } catch (err) {
            console.error('Failed to load blocked venue periods from backend', err);
        }
    };

    const fetchVenues = async (isMounted: () => boolean) => {
        try {
            const venuesFromDatabase = await venueApi.getFeaturedVenues();

            if (isMounted()) {
                setVenues(venuesFromDatabase);
                setVenueLoadError(null);
            }
        } catch (error) {
            console.error("Failed to fetch venues", error);

            if (isMounted()) {
                setVenueLoadError("Could not load venues from the database.");
                setVenues([]);
            }
        }

        if (isMounted()) {
            setIsLoadingVenues(false);
        }
    };
    // load the dates of blocked venues from backend
    useEffect(() => {
        let mounted = true;
        fetchBlocked(() => mounted);
        return () => {
            mounted = false;
        };
    }, [venues]);
    // load the venues from the database to populate the dropdown
    useEffect(() => {
        let mounted = true;
        fetchVenues(() => mounted);
        return () => {
            mounted = false;
        };
    }, []);



    // check if selected venue is blocked on the chosen date
    const checkIfVenueBlocked = (venueName: string, eventDate: string) => {
        const selectedVenue = venues.find((venue) => venue.venueName === venueName);
        // If venue not found, returns false
        if (!selectedVenue) {
            console.error(`Unable to find: ${venueName}`);
            return false;
        }
        const eventDay = new Date(eventDate);
        // go through each blocked period for this venue
        for (let i = 0; i < blockedVenues.length; i++) {
            const blocked = blockedVenues[i];

            if (blocked.venueId === selectedVenue.id) {
                const start = new Date(blocked.startDate);
                const end = new Date(blocked.endDate);
                if (eventDay >= start && eventDay <= end) {
                    return true;
                }
            }
        }
        return false;
    };

    // handle form fields
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const isNumericField = name === "numGuests" || name === "eventDuration";

        setFormData((prevState) =>
        ({
            ...prevState,
            [name]: isNumericField ? Number(value) : value,
        } as Post)
        );
    };

    // Handles form submission and validation
    const handleSubmit = async (e: React.BaseSyntheticEvent) => {
        e.preventDefault();

        const storedUser = localStorage.getItem("loggedInUser");
        if (!storedUser) {
            return;
        }

        const currentUser = JSON.parse(storedUser);

        let hirerRecord: any;
        try {
            hirerRecord = await hirerApi.getHirerByUserID(Number(currentUser.id));
        } catch (err) {
            console.error("Failed to fetch hirer for user", err);
            alert("Could not verify hirer record. Please try again.");
            return;
        }

        if (!hirerRecord || !hirerRecord.id) {
            alert("No hirer profile found for your account. Please create a hirer profile before applying.");
            return;
        }

        if (!formData.eventDate) {
            alert("Please select a valid event date (today or later).");
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedEventDate = new Date(formData.eventDate);
        selectedEventDate.setHours(0, 0, 0, 0);

        if (selectedEventDate <= today) {
            alert("Event date must be in the future (not today or in the past).");
            return;
        }

        if (checkIfVenueBlocked(formData.venue ?? "", formData.eventDate)) {
            alert("Selected date/time is unavailable for the chosen venue. Please select a different date or venue.");
            return;
        }

        const selectedVenue = venues.find((v) => v.venueName === formData.venue);
        if (!selectedVenue) {
            alert("Please select a valid venue.");
            return;
        }

        if ((formData.numGuests ?? 0) > selectedVenue.capacity) {
            alert(`The number of guests cannot exceed venue capacity: (${selectedVenue.capacity}).`);
            return;
        }

        const payload = {
            venueId: selectedVenue.id,
            venue: selectedVenue.venueName,
            hirerId: Number(hirerRecord.id),
            eventName: formData.eventName,
            guestNum: formData.numGuests,
            hireDate: formData.eventDate,
            startTime: formData.eventTime,
            hours: formData.eventDuration || 0,
            comment: formData.comment || "",
        };

        try {
            await venueApplicationApi.createVenueApplication(payload);
            setSubmitted(true);
        } catch (err) {
            console.error("Failed to create application on backend", err);
            alert("Something went wrong saving your application to the server. Please try again.");
        }
    };

    const labelClassName = "block text-sm font-medium text-white-700";
    const inputClassName = "mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";
    const selectedVenueCapacity = venues.find((v) => v.venueName === formData.venue)?.capacity;
    const minEventDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    return (
        <FormLayout>
            <div className="min-h-screen flex flex-col justify-center p-4">
                <div className="w-full max-w-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Create a new application</h1>

                    {submitted ? (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <p>Application Submitted</p>
                            <Link href="/hirer" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white">
                                Back to home page
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* venue */}
                            <div>
                                <label htmlFor="venue" className={labelClassName}>
                                    Venue
                                </label>
                                <select
                                    id="venue"
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleInputChange}
                                    required
                                    className={inputClassName}
                                >
                                    <option value="" disabled>
                                        Select a venue
                                    </option>
                                    {venues.map((venue) => (
                                        <option key={venue.id} value={venue.venueName}>
                                            {venue.venueName}
                                        </option>
                                    ))}
                                </select>
                                {isLoadingVenues && (
                                    <p className="mt-2 text-sm text-gray-600">Loading venues from the database...</p>
                                )}
                                {venueLoadError && (
                                    <p className="mt-2 text-sm text-red-400">{venueLoadError}</p>
                                )}
                            </div>

                            {/* event name */}
                            <div>
                                <label htmlFor="eventName" className={labelClassName}>
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    id="eventName"
                                    name="eventName"
                                    value={formData.eventName}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Birthday Party"
                                    className={inputClassName}
                                />
                            </div>

                            {/* number of guests */}
                            <div>
                                <label htmlFor="numGuests" className={labelClassName}>
                                    Number of Guests
                                </label>
                                <input
                                    type="number"
                                    id="numGuests"
                                    name="numGuests"
                                    value={formData.numGuests}
                                    onChange={handleInputChange}
                                    min={1}
                                    max={selectedVenueCapacity}
                                    required
                                    className={inputClassName}
                                />
                                {selectedVenueCapacity !== undefined && (
                                    <p className="mt-1 text-xs text-gray-600">Maximum capacity: {selectedVenueCapacity}</p>
                                )}
                            </div>

                            {/* date */}
                            <div>
                                <label htmlFor="eventDate" className={labelClassName}>
                                    Event Date
                                </label>
                                <input
                                    type="date"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleInputChange}
                                    min={minEventDate}
                                    required
                                    className={inputClassName}
                                />
                            </div>

                            {/* time */}
                            <div>
                                <label htmlFor="eventTime" className={labelClassName}>
                                    Event Time
                                </label>
                                <input
                                    type="time"
                                    id="eventTime"
                                    name="eventTime"
                                    value={formData.eventTime}
                                    onChange={handleInputChange}
                                    required
                                    className={inputClassName}
                                />
                            </div>

                            {/* duration */}
                            <div>
                                <label htmlFor="eventDuration" className={labelClassName}>
                                    Event Duration (hours)
                                </label>
                                <input
                                    type="number"
                                    id="eventDuration"
                                    name="eventDuration"
                                    value={formData.eventDuration}
                                    onChange={handleInputChange}
                                    min={1}
                                    required
                                    className={inputClassName}
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Submit
                            </button>
                        </form>
                    )}

                    <div className="w-full max-w-md my-4">
                        <Link
                            href="/hirer"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
                        >
                            Back to home page
                        </Link>
                    </div>
                </div>
            </div>
        </FormLayout>
    );
}
