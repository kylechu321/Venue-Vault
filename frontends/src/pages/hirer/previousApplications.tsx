import { BackendApplication } from "@/services/venueApplicationApi";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { LayOut } from "@/components/layout/layOut";
import { hirerApi } from "@/services/hirerApi";
import { venueApplicationApi } from "@/services/venueApplicationApi";
import { venueApi } from "@/services/venueApi";


export default function PrevApplication() {
    //check for link pasting for not logged in user
    UseWebAuthGuard();

    const [posts, setApplications] = useState<BackendApplication[]>([]);
    const [venueNameById, setVenueNameById] = useState<Record<number, string>>({});

    const getStatusText = (pending: number | null | undefined) => {
        if (pending === 1) {
            return "Approved";
        } else if (pending === 0) {
            return "Rejected";
        }

        return "Rejected";
    };

    useEffect(() => {
        const loadApplications = async () => {
            if (typeof window === "undefined") {
                return;
            }

            const storedUser = window.localStorage.getItem("loggedInUser");

            if (!storedUser) {
                setApplications([]);
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser) as { id?: string };
                if (!parsedUser.id) {
                    setApplications([]);
                    return;
                }

                const hirer = await hirerApi.getHirerByUserID(Number(parsedUser.id));
                const [allApplications, venues] = await Promise.all([
                    venueApplicationApi.getAllVenueApplications(),
                    venueApi.getAllVenues(),
                ]);

                const venueLookup = venues.reduce<Record<number, string>>((acc, venue) => {
                    acc[venue.id] = venue.venueName;
                    return acc;
                }, {});

                setVenueNameById(venueLookup);

                const previousApplications = allApplications
                    .filter((application) => application.hirerId === hirer.id)
                    .filter((application) => application.pending === 1 || application.pending === 0)
                    .slice()
                    .reverse();

                setApplications(previousApplications);
            } catch (error) {
                console.error("Failed to load previous applications", error);
                setApplications([]);
            }
        };

        loadApplications();
    }, []);
    return (
            <LayOut>
                 <div className="w-full max-w-md my-4">
                    <Link href="/hirer" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
                        Back to home page
                    </Link>
                </div>
                <h1 className="m-0 text-[clamp(2rem,4vw,3rem)] font-extralight leading-[1.1] tracking-[-0.02em]">
                    Previous Applications
                </h1>
                <div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {posts.map((application) => (
                            <div key={application.id} className="h-full bg-white p-8 rounded-lg shadow-md border border-gray-300">
                                <h3 className="text-lg font-semibold mb-2">
                                    {application.venue || (application.venueId ? venueNameById[Number(application.venueId)] : undefined) || "Unknown venue"}
                                </h3>
                                <p className="text-gray-600 mb-2">{application.eventName || "(no event name)"}</p>
                                <p className="text-gray-600 mb-2">Guests: {application.guestNum ?? "N/A"}</p>
                                <p className="text-gray-600 mb-2">
                                    Event Date: {application.hireDate ? new Date(application.hireDate).toLocaleDateString() : "N/A"}
                                </p>
                                <p className="text-gray-600 mb-2">Event Time: {application.startTime || "N/A"}</p>
                                <p className="text-gray-600 mb-2">
                                    Duration: {application.hours ?? "N/A"} hours
                                </p>
                                <p className="text-gray-600 mb-2">
                                        Status:{" "}
                                        <span className={application.pending === 1 ? "text-green-500" : "text-red-500"}>
                                            {getStatusText(application.pending)}
                                    </span>
                                </p>
                                {application.comment && (
                                    <p className="text-gray-600 mb-2">
                                        Comment from Vendor: {application.comment}
                                    </p>
                                )}  
                            </div>
                        ))}
                        {posts.length === 0 && (
                            <p className="col-span-full text-gray-600">No applications found. Please wait for an update.</p>
                        )}
                    </div>
                </div>
            </LayOut>
    );
}
