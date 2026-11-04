import { BackendApplication } from "@/services/venueApplicationApi";
import { useState, useEffect } from "react";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { LayOut } from "@/components/layout/layOut";
import { venueApplicationApi } from "@/services/venueApplicationApi";
import { hirerApi } from "@/services/hirerApi";
import { venueApi } from "@/services/venueApi";

export default function HirerHome() {
    //check for link pasting for not logged in user
    UseWebAuthGuard();

    const [posts, setApplications] = useState<BackendApplication[]>([]);
    const [venueNameById, setVenueNameById] = useState<Record<number, string>>({});
    const [hirerFirstName, setHirerFirstName] = useState<string>("Hirer");
    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        // Get the current logged in user from local storage
        try {
            const storedUser = localStorage.getItem("loggedInUser");
            if (!storedUser) {
                setApplications([]);
                return;
            }

            // Get the hirer record associated with the current user
            const currentUser = JSON.parse(storedUser);
            setHirerFirstName(currentUser?.firstName || "Hirer");
            const hirerRecord = await hirerApi.getHirerByUserID(Number(currentUser.id));

            if (!hirerRecord?.id) {
                setApplications([]);
                return;
            }

            const [all, venues] = await Promise.all([
                venueApplicationApi.getAllVenueApplications(),
                venueApi.getAllVenues(),
            ]);

            const venueLookup = venues.reduce<Record<number, string>>((acc, venue) => {
                acc[venue.id] = venue.venueName;
                return acc;
            }, {});

            setVenueNameById(venueLookup);

            // Only show applications that have not been marked as pending.
            const visibleApplications = all
                .filter(
                    (application: BackendApplication) =>
                        Number(application.hirerId) === Number(hirerRecord.id) && application.pending === null
                )
                .slice()
                .reverse();
            setApplications(visibleApplications);
        } catch (error) {
            console.error("Failed to load applications", error);
        }
    };

    return (
        <LayOut>
            <div className="w-full space-y-10">
                <header className="space-y-6">
                    <h1 className="m-0 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                        Hirer Home Page
                    </h1>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <Link
                            href="/hirer/newApplication"
                            className="inline-flex items-center justify-center rounded-md border border-blue-400/30 bg-blue-500 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-600 text-white"
                        >
                            Create a New Application
                        </Link>


                        <Link
                            href="/hirer/previousApplications"  // Will need to create this page to show previous applications
                            className="inline-flex items-center justify-center rounded-md border border-blue-400/30 bg-blue-500 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-600 text-white"
                        >
                            View Previous Applications
                        </Link>

                        <Link
                            href="/hirer/viewVendors"
                            className="inline-flex items-center justify-center rounded-md border border-blue-400/30 bg-blue-500 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-600 text-white"
                        >
                            View Venues
                        </Link>

                        <Link
                            href="/hirer/venuePreferences"
                            className="inline-flex items-center justify-center rounded-md border border-blue-400/30 bg-blue-500 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-600 text-white"
                        >
                            Venue Preferences
                        </Link>

                        <Link
                            href="/hirer/profile"
                            className="inline-flex items-center justify-center rounded-md border border-blue-400/30 bg-blue-500 px-4 py-3 text-sm font-medium transition-colors hover:bg-blue-600 text-white"
                        >
                            View Profile
                        </Link>
                    </div>
                </header>

                <section>
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Current Applications</h2>
                        <span className="rounded-full border border-gray-400 px-3 py-1 text-xs text-gray-700">
                            {posts.length} pending
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {/*    in week 4 lecture activity 4*/}
                        {posts.map((post) => (
                            <article key={post.id} className="h-full rounded-xl border border-gray-300 bg-white p-7 shadow-md">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {post.venue || (post.venueId ? venueNameById[Number(post.venueId)] : undefined) || "Unknown venue"}
                                </h3>
                                <p className="mt-1 mb-5 text-sm text-gray-600">{post.eventName || "(no event name)"}</p>
                                <p className="mb-2 text-gray-700">
                                    <span className="font-medium">Hours:</span> {post.hours ?? "N/A"}
                                </p>
                                <p className="mb-2 text-gray-700">
                                    <span className="font-medium">Event Date:</span> {post.hireDate ? new Date(post.hireDate).toLocaleDateString() : "N/A"}
                                </p>
                                <div className="text-xs text-gray-600">
                                    <span>Posted by {hirerFirstName}</span>
                                    <span className="mx-2">•</span>
                                    <span>Application #{post.id}</span>
                                </div>
                            </article>
                        ))}
                        {posts.length === 0 && (
                            <p className="col-span-full rounded-lg border border-dashed border-gray-400 p-6 text-center text-gray-700">
                                No applications found. Please create a new application.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </LayOut>
    );
}
