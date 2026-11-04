import { useRouter } from "next/router";
import {
    Post,
    ComplianceDocument, } from "@/types/application";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LayOut } from "@/components/layout/layOut";
import ApplicationCard from "@/components/vendorComponent/applicationCard";
import { api as backendApi, venueApplicationApi } from "@/services/venueApplicationApi";
import { venueApi } from "@/services/venueApi";
import { hirerApi } from "@/services/hirerApi";
import { userApi } from "@/services/userApi";
import { venueHirerStatsAPI } from "@/services/venuehirerApi";
import { LoggedInUser } from "@/types/user";
import { transformApplication } from "@/types/application";
import { VendorRecord, VenueRecord } from "@/types/venues";

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

export default function VendorHome() {
    const router = useRouter();
    const [posts, setApplications] = useState<Post[]>([]);
    const [approvedPosts, setApprovedPosts] = useState<Post[]>([]);
    const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
    const [reputationMap, setReputationMap] = useState<Record<string, number>>({});
    const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
    const [complianceDocs, setComplianceDocs] = useState<ComplianceDocument[]>([]);

    useEffect(() => {
        loadVendorApplications();
    }, []);

    const loadVendorApplications = async () => {
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

            const hirers = (await hirerApi.getAllHirers()) as Array<{
                id: number;
                userID: number;
                driverLicenseDoc?: string;
                insuranceDoc?: string;
                registrationDoc?: string;
            }>;
            const users = await userApi.getAllUsers();

            const docsFromHirerTable: ComplianceDocument[] = hirers.flatMap((hirer) => {
                const docs: ComplianceDocument[] = [];

                if (hirer.driverLicenseDoc) {
                    docs.push({
                        id: `${hirer.id}-driver-license`,
                        hirerId: String(hirer.id),
                        name: "Driver License",
                        type: "license",
                        uploadedDate: "",
                        fileUrl: hirer.driverLicenseDoc,
                        expiryDate: "",
                        verified: false,
                    });
                }

                if (hirer.insuranceDoc) {
                    docs.push({
                        id: `${hirer.id}-insurance`,
                        hirerId: String(hirer.id),
                        name: "Insurance",
                        type: "insurance",
                        uploadedDate: "",
                        fileUrl: hirer.insuranceDoc,
                        expiryDate: "",
                        verified: false,
                    });
                }

                if (hirer.registrationDoc) {
                    docs.push({
                        id: `${hirer.id}-registration`,
                        hirerId: String(hirer.id),
                        name: "Registration",
                        type: "certification",
                        uploadedDate: "",
                        fileUrl: hirer.registrationDoc,
                        expiryDate: "",
                        verified: false,
                    });
                }

                return docs;
            });

            setComplianceDocs(docsFromHirerTable);

            if (vendorVenues.length === 0) {
                setApplications([]);
                setApprovedPosts([]);
                setCommentDrafts({});
                setReputationMap({});
                return;
            }

            const hirerUserMap = new Map<number, string>();
            hirers.forEach((hirer) => {
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
                const venueApps = await venueApplicationApi.getVenueApplicationsByVenueId(venue.id);
                const transformedApps = venueApps.map((app: any) =>
                    transformApplication(
                        app,
                        venueNameMap.get(venue.id) || `Venue ${venue.id}`,
                        hirerUserMap.get(Number(app.hirerId)) || `Hirer ${app.hirerId}`
                    )
                );
                allApplications.push(...transformedApps);
            }

            const pendingApps = allApplications.filter((app) => app.status === "pending").reverse();
            const approvedApps = allApplications.filter((app) => app.status === "approved").reverse();

            setApplications(pendingApps);
            setApprovedPosts(approvedApps);
            setCommentDrafts(
                pendingApps.reduce((acc, app) => {
                    acc[app.id] = app.comment || "";
                    return acc;
                }, {} as Record<string, string>)
            );

            const hirerStats = await venueHirerStatsAPI.getHirerStats();
            const map: Record<string, number> = {};

            hirerStats.forEach((stat) => {
                map[String(stat.hirerId)] = stat.ratingOfTheHirer;
            });

            setReputationMap(map);
        } catch (error) {
            console.error("Failed to load vendor applications:", error);
        }
    };


        

    const sortedPosts = (list: Post[]) => {
        if (sortOrder === "default") {
            return list;
        } else {
            return [...list].sort((a, b) => {
                const aHirerId = String(a.hirerId ?? "");
                const bHirerId = String(b.hirerId ?? "");
                const diff = (reputationMap[aHirerId] ?? 0) - (reputationMap[bHirerId] ?? 0);
                return sortOrder === "desc" ? -diff : diff;
            });
        }
    };


    const handleViewProfile = async (hirerId: number) => {
        router.push(`/vendor/vendorSideViewHirerProfile?hirerId=${hirerId}`);
    };

    const updateApplicationStatus = async (postId: string, status: "approved" | "rejected") => {
        try {
            const commentText = commentDrafts[postId] || "";
            const pendingValue = status === "approved" ? 1 : 0;

            await venueApplicationApi.updateVenueApplicationPending(postId, {
                comment: commentText,
                pending: pendingValue,
            });

            window.location.reload();
        } catch (error) {
            console.error("Failed to update application status", error);
        }
    };

    const handleApprove = (postId: string) => {
        updateApplicationStatus(postId, "approved");
    };

    const handleReject = (postId: string) => {
        updateApplicationStatus(postId, "rejected");
    };

    const getHirerComplianceDocs = (post: Post) => {
        return complianceDocs.filter((doc) => doc.hirerId === String(post.hirerId));
    };

    const getCredibilityStars = (post: Post) => {
        const uploadedCount = getUploadedCount(post);
        return uploadedCount === 0 ? 0 : Math.round((Math.min(uploadedCount, 3) / 3) * 5);
    };

    const getUploadedCount = (post: Post) => {
        const hirerDocs = getHirerComplianceDocs(post);
        return hirerDocs.filter((doc) => Boolean(doc.fileUrl)).length;
    };

    return (
        <LayOut>
            <div className="w-full space-y-10">
                <header className="space-y-6">
                    <h1 className="m-0 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.02em]">
                        Vendors Home Page
                    </h1>
                    <div className="flex gap-2">
                        <Link
                            href="/vendor/blockVenue"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
                        >
                            Manage Venue
                        </Link>
                        <Link
                            href="/vendor/hirerStats"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
                        >
                            View Hirer
                        </Link>
                        <Link
                            href="/vendor/updateProfile"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
                        >
                            Update Profile
                        </Link>
                        <Link
                            href="/vendor/viewApplications"
                            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white"
                        >
                            View Previous Applications
                        </Link>
                    </div>
                </header>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">Sort by reputation:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as "default" | "asc" | "desc")}
                        className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded px-2 py-1"
                    >
                        <option value="default">Default</option>
                        <option value="desc">Highest first</option>
                        <option value="asc">Lowest first</option>
                    </select>
                </div>

                <section>
                    <div className="w-full">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">Pending Applications</h2>
                            <span className="rounded-full border border-gray-400 px-3 py-1 text-xs text-gray-700">
                                {posts.length} pending
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 auto-rows-fr">
                            {sortedPosts(posts).map((post) => {
                                const credibilityStars = getCredibilityStars(post);
                                const uploadedCount = getUploadedCount(post);
                                const hirerComplianceDocs = complianceDocs.filter((doc) => doc.hirerId === String(post.hirerId));
                                const hirerId = String(post.hirerId ?? "");

                                return (
                                    <div key={post.id} className="h-full">
                                        <ApplicationCard
                                            post={post}
                                            reputation={reputationMap[hirerId] ?? 0}
                                            credibilityStars={credibilityStars}
                                            uploadedCount={uploadedCount}
                                            complianceDocs={hirerComplianceDocs}
                                            showActions
                                            commentValue={commentDrafts[post.id] ?? ""}
                                            onCommentChange={(value) => {
                                                setCommentDrafts((prev) => ({ ...prev, [post.id]: value }));
                                            }}
                                            onViewProfile={handleViewProfile}
                                            onApprove={handleApprove}
                                            onReject={handleReject}
                                        />
                                    </div>
                                );
                            })}
                            {posts.length === 0 && (
                                <p className="col-span-full rounded-lg border border-dashed border-gray-400 p-6 text-center text-gray-700">
                                    No applications found. Please check back later for updates.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </LayOut>
    );
}
