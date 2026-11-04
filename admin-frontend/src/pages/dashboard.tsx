import { useEffect, useState } from "react";
import { LayOut } from "@/components/layouts/layOut";
import Link from "next/link";
import { UseAdminAuthGuard } from "@/components/webAuthGuard";
import { venueManagementServices } from "@/service/managementAPI";
import { PopularVenueReport, ActiveApplicantReport } from "@/types/applications";
import { DashboardReports } from "@/components/dashboardReports";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { ReportPDF } from "@/components/reportPDF";

export default function Dashboard() {
    UseAdminAuthGuard();
    const [popularVenues, setPopularVenues] = useState<PopularVenueReport[]>([]);
    const [activeApplicants, setActiveApplicants] = useState<ActiveApplicantReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([
            venueManagementServices.getTopPopularVenues(),
            venueManagementServices.getTopActiveApplicants(),
        ])
            .then(([venues, applicants]) => {
                setPopularVenues(venues);
                setActiveApplicants(applicants);
            })
            .catch(() => setError("Failed to load reports"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <LayOut>
            <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <h1 className="text-3xl font-light tracking-tight text-gray-900">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <Link href="/venues" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white text-sm">
                        Manage Venues
                    </Link>
                    <Link href="/vendors" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white text-sm">
                        Manage Vendors
                    </Link>
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? <p className="text-gray-500">Loading reports...</p> : (
                <DashboardReports popularVenues={popularVenues} activeApplicants={activeApplicants} />
            )}
            {loading ? (
                <button
                    type="button"
                    disabled
                    className="bg-emerald-500 px-4 py-2 rounded text-white text-sm opacity-60"
                >
                    Download PDF
                </button>
            ) : (
                <PDFDownloadLink
                    document={<ReportPDF popularVenues={popularVenues} activeApplicants={activeApplicants} />}
                    fileName={`admin-dashboard-reports-${new Date().toISOString().slice(0, 10)}.pdf`}
                    className="inline-block bg-emerald-500 px-4 py-2 rounded hover:bg-emerald-600 text-white text-sm"
                >
                    {({ loading: pdfLoading }) => (pdfLoading ? "Preparing PDF..." : "Download Report as PDF")}
                </PDFDownloadLink>
            )}
        </LayOut>
    );
}