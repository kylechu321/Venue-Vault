import { Post, PostStatus, transformApplication } from "@/types/application";
import { BackendApplication } from "@/services/venueApplicationApi";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UseWebAuthGuard } from "@/components/webAuthGuard";
import { LayOut } from "@/components/layout/layOut";
import { api as backendApi, venueApplicationApi } from "@/services/venueApplicationApi";
import { venueApi } from "@/services/venueApi";
import { hirerApi } from "@/services/hirerApi";
import { userApi } from "@/services/userApi";
import { LoggedInUser } from "@/types/user";
import { VendorRecord, VenueRecord } from "@/types/venues";

export default function ApprovedApplications() {
    //check for link pasting for not logged in user
    UseWebAuthGuard();

    const [posts, setApplications] = useState<Post[]>([]);
    const commentRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

    const getLoggedInUser = (): LoggedInUser | null => {
        const storedUser = localStorage.getItem("loggedInUser");
        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser) as LoggedInUser;
        } catch (error) {
            console.error("Failed to parse logged in user", error);
            return null;
        }
    };

    const getStatusText = (status: PostStatus) => {
        return status === "approved" ? "Approved" : "Rejected";
    };

    useEffect(() => {
        loadApprovedApplications();
    }, []);

    const loadApprovedApplications = async () => {
        try {
            const loggedInUser = getLoggedInUser();
            if (!loggedInUser?.id) {
                console.error("No logged-in user found");
                return;
            }

            const currentUserId = Number(loggedInUser.id);
            const vendorsResponse = await backendApi.get<VendorRecord[]>("/vendors");
            const vendors = Array.isArray(vendorsResponse.data) ? vendorsResponse.data : [];
            const vendor = vendors.find((v) => v.userID === currentUserId);

            if (!vendor) {
                console.error("No vendor profile found for current user");
                return;
            }

            const venues = (await venueApi.getAllVenues()) as VenueRecord[];
            const vendorVenues = venues.filter((v) => v.vendorId === vendor.id);

            if (vendorVenues.length === 0) {
                setApplications([]);
                return;
            }

            const hirers = await hirerApi.getAllHirers();
            const users = await userApi.getAllUsers();

            const hirerUserMap = new Map<number, string>();
            hirers.forEach((hirer: { id: number; userID: number }) => {
                const user = users.find((u) => Number(u.id) === hirer.userID);
                if (user) {
                    hirerUserMap.set(hirer.id, user.firstName);
                }
            });

            const venueNameMap = new Map<number, string>();
            vendorVenues.forEach((venue) => {
                venueNameMap.set(venue.id, venue.venueName || `Venue ${venue.id}`);
            });

            const allApplications: Post[] = [];
            for (const venue of vendorVenues) {
                const venueApplications = await venueApplicationApi.getVenueApplicationsByVenueId(venue.id);
                const transformed = venueApplications.map((application: BackendApplication) =>
                    transformApplication(
                        application,
                        venueNameMap.get(venue.id) || `Venue ${venue.id}`,
                        hirerUserMap.get(Number(application.hirerId)) || `Hirer ${application.hirerId}`
                    )
                );
                allApplications.push(...transformed);
            }

            const reviewedApplications = allApplications
                .filter((application) => application.status === "approved" || application.status === "rejected")
                .reverse();

            setApplications(reviewedApplications);
        } catch (error) {
            console.error("Failed to load approved applications", error);
        }
    };


    const handleSaveComment = async (applicationId: string | number) => {
        const applicationToSave = posts.find((post) => post.id === applicationId);
        const commentValue = commentRefs.current[applicationId]?.value ?? applicationToSave?.comment ?? "";

        if (!applicationToSave) {
            return;
        }

        try {
            await venueApplicationApi.updateVenueApplicationPending(applicationId, {
                pending: applicationToSave.pending ?? 1,
                comment: commentValue,
            });

            setApplications((prev) =>
                prev.map((post) => (post.id === applicationId ? { ...post, comment: commentValue } : post))
            );
        } catch (error) {
            console.error("Failed to save comment", error);
        }
    };

    return (
        <LayOut>
            <h1 className="m-0 text-[clamp(2rem,4vw,3rem)] font-extralight leading-[1.1] tracking-[-0.02em]">
                Previous Applications
            </h1>

            <div className="w-full max-w-md my-4">
                <Link href="/vendor" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white">
                    Back to home page
                </Link>
            </div>

            <div className="w-full max-w-6xl mx-auto">
                <h2 className="text-xl font-semibold mb-4">Reviewed Applications</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {posts.map((application) => (
                        <div key={application.id} className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gray-300 h-full min-h-[420px] flex flex-col">
                            <h3 className="text-xl font-semibold mb-4">{application.venue}</h3>
                            <div className="space-y-2 text-[15px] flex-1">
                                <p className="text-gray-600">{application.eventName}</p>
                                <p className="text-gray-600">Guests: {application.numGuests}</p>
                                <p className="text-gray-600">
                                    Event Date: {new Date(application.eventDate ?? application.createdAt ?? "").toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">Event Time: {application.eventTime}</p>
                                <p className="text-gray-600">
                                    Duration: {application.eventDuration} hours
                                </p>
                                <p className="text-gray-600">
                                    Status:{" "}
                                    <span className={application.status === "approved" ? "text-green-500" : "text-red-500"}>
                                        {getStatusText(application.status ?? "pending")}
                                    </span>
                                </p>
                                {application.comment && (
                                    <p className="text-gray-600 mb-1">
                                        Comment from Vendor: {application.comment}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4">
                                <label
                                    htmlFor={`comment-${application.id}`}
                                    className="block text-sm font-medium text-gray-300 mb-1"
                                >
                                    Change Comment
                                </label>
                                <textarea
                                    id={`comment-${application.id}`}
                                    name="comment"
                                    placeholder="Write a comment here"
                                    defaultValue={application.comment}
                                    ref={(element) => {
                                        commentRefs.current[application.id] = element;
                                    }}
                                    className="w-full min-h-[120px] rounded-md border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400"
                                />
                            </div>
                            <div className="mt-5 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleSaveComment(application.id)}
                                    className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-3 px-5 rounded"
                                >
                                    Save Comment
                                </button>

                            </div>
                            <div className="text-sm text-gray-500 mt-4">
                                <span>Posted by {application.hirerUsername}</span>
                                <span className="mx-2">•</span>
                                <span>{new Date(application.createdAt ?? application.eventDate ?? "").toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <p className="text-gray-600">No approved applications found.</p>
                    )}
                </div>
            </div>
        </LayOut>
    );
}


