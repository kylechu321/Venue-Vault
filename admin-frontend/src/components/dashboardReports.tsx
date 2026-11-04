import { ActiveApplicantReport, PopularVenueReport } from "@/types/applications";

type DashboardReportsProps = {
    popularVenues: PopularVenueReport[];
    activeApplicants: ActiveApplicantReport[];
};

export function DashboardReports({ popularVenues, activeApplicants }: DashboardReportsProps) {
    return (
        <>
            {/* Top 3 Popular Venues */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Top 3 Most Popular Venues</h2>
            <div className="rounded-xl border border-gray-300 overflow-hidden mb-10">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Venue</th>
                            <th className="px-4 py-3">Location</th>
                            <th className="px-4 py-3">Total Bookings</th>
                            <th className="px-4 py-3">Most Popular Day</th>
                            <th className="px-4 py-3">Most Popular Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {popularVenues.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">No data available</td>
                            </tr>
                        ) : (
                            popularVenues.map((report) => (
                                <tr key={report.rank} className="border-t border-gray-200">
                                    <td className="px-4 py-3 font-bold text-blue-600">#{report.rank}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">{report.venue.venueName}</td>
                                    <td className="px-4 py-3 text-gray-700">{report.venue.location}</td>
                                    <td className="px-4 py-3">{report.totalBookings}</td>
                                    <td className="px-4 py-3">{report.mostPopularDay}</td>
                                    <td className="px-4 py-3">{report.mostPopularTimeSlot}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Top 3 Active Applicants */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Top 3 Most Active Applicants</h2>
            <div className="rounded-xl border border-gray-300 overflow-hidden mb-10">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Successful Bookings</th>
                            <th className="px-4 py-3">Total Applications</th>
                            <th className="px-4 py-3">Success Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeApplicants.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">No data available</td>
                            </tr>
                        ) : (
                            activeApplicants.map((report) => (
                                <tr key={report.rank} className="border-t border-gray-200">
                                    <td className="px-4 py-3 font-bold text-blue-600">#{report.rank}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {report.hirer.firstName} {report.hirer.lastName}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">{report.hirer.email}</td>
                                    <td className="px-4 py-3">{report.successfulBookings}</td>
                                    <td className="px-4 py-3">{report.totalApplications}</td>
                                    <td className="px-4 py-3">
                                        <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                            {report.successRate}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
