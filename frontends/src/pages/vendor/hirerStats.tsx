import {useState, useEffect} from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
    HirerTable,
    HirerTableHeader,
    HirerTableRow,
    HirerTableHead,
    HirerTableCell,
    HirerTableBody,
} from "@/components/vendorComponent/vendorTableComponent";
import { LayOut } from "@/components/layout/layOut";
import { venueHirerStatsAPI } from "@/services/venuehirerApi";
import { HirerStat, ChartView, HirerChartStat } from "@/types/venueHirerStats";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts";

export default function ApplicantStats() {
    const router = useRouter();
    const [stats, setStats] = useState<HirerStat[]>([]);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [loading, setLoading] = useState(true);
    const [chartStats, setChartStats] = useState<HirerChartStat[]>([]);
    const [chartView, setChartView] = useState<ChartView>("perVenue");
    const [selectedHirerId, setSelectedHirerId] = useState<number | null>(null);

    useEffect(() => {
        Promise.all([
            venueHirerStatsAPI.getHirerStats(),
            venueHirerStatsAPI.getHirerChartStats(),
        ])
            .then(([statsData, chartData]) => {
                setStats(statsData);
                setChartStats(chartData);
            })
            .catch((err) => console.error("Failed to load hirer stats", err))
            .finally(() => setLoading(false));
    }, []);

    const sortedStats = [...stats].sort((a, b) =>
        sortDir === "desc"
            ? b.approvalCount - a.approvalCount
            : a.approvalCount - b.approvalCount
    );

    const getStatus = (stat: HirerStat) => {
        if (stat.approvalCount === 0) {
            return "Not Selected";
        }
        const max = Math.max(...stats.map((s) => s.approvalCount));
        if (stat.approvalCount === max) {
            return "Most Chosen";
        }
        const min = Math.min(
            ...stats.filter(
                (s) => s.approvalCount > 0).map((s) => s.approvalCount));
        if (stat.approvalCount === min) {
            return "Least Chosen";
        }
        return null;
    };

    const statusStyle: Record<string, string> = {
        "Most Chosen": "bg-emerald-100 text-emerald-700",
        "Least Chosen": "bg-amber-100 text-amber-700",
        "Not Selected": "bg-gray-200 text-gray-700",
    };

    const filteredChartStats = selectedHirerId
        ? chartStats.filter((h) => h.hirerId === selectedHirerId)
        : chartStats;

    const stackedBarData = filteredChartStats.map((h) => ({
        name: h.hirerName,
        Approved: h.totalApproved,
        Pending: h.totalPending,
    }));

    return (
        <LayOut>
            <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
                <h1 className="text-3xl font-light tracking-tight text-gray-900">Applicant Selection Stats</h1>
                <Link href="/vendor" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 text-white">
                    Back to Home
                </Link>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-700">Sort by approvals:</span>
                <select
                    value={sortDir}
                    onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
                    className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded px-2 py-1"
                >
                    <option value="desc">Most chosen first</option>
                    <option value="asc">Least chosen first</option>
                </select>
            </div>

            <div className="rounded-xl w-full border border-gray-300 overflow-hidden mb-10">
                <HirerTable>
                    <HirerTableHeader>
                        <HirerTableRow>
                            <HirerTableHead>#</HirerTableHead>
                            <HirerTableHead>Name</HirerTableHead>
                            <HirerTableHead>Rating</HirerTableHead>
                            <HirerTableHead>Approvals</HirerTableHead>
                            <HirerTableHead>Total Apps</HirerTableHead>
                            <HirerTableHead>Status</HirerTableHead>
                        </HirerTableRow>
                    </HirerTableHeader>
                    <HirerTableBody>
                        {loading ? (
                            <HirerTableRow>
                                <HirerTableCell className="text-center text-gray-500 py-6">
                                    Loading...
                                </HirerTableCell>
                            </HirerTableRow>
                        ) : sortedStats.map((stat, i) => {
                            const status = getStatus(stat);
                            return (
                                <HirerTableRow key={stat.id}>
                                    <HirerTableCell>{i + 1}</HirerTableCell>
                                    <HirerTableCell>
                                        <button
                                            type="button"
                                            onClick={() => router.push(`/vendor/vendorSideViewHirerProfile?hirerId=${stat.hirerId}`)}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {stat.firstNameOfHirer} {stat.lastNameOfHirer}
                                        </button>
                                    </HirerTableCell>
                                    <HirerTableCell>
                                        {stat.ratingOfTheHirer
                                            ? <span className="text-yellow-500">
                                                {"★".repeat(stat.ratingOfTheHirer)}
                                                {"☆".repeat(5 - stat.ratingOfTheHirer)}</span>
                                            : <span className="text-gray-700">—</span>}
                                    </HirerTableCell>
                                    <HirerTableCell>{stat.approvalCount}</HirerTableCell>
                                    <HirerTableCell>{stat.totalCount}</HirerTableCell>
                                    <HirerTableCell>
                                        {status && (
                                            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${statusStyle[status]}`}>
                                                {status}
                                            </span>
                                        )}
                                    </HirerTableCell>
                                </HirerTableRow>
                            );
                        })}
                    </HirerTableBody>
                </HirerTable>
            </div>

            {/*chart control*/}
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex rounded-lg overflow-hidden border border-gray-300">
                    <button
                        onClick={() => setChartView("perVenue")}
                        className={`px-4 py-2 text-sm font-medium ${chartView === "perVenue" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                    >
                        Per Venue
                    </button>
                    <button
                        onClick={() => setChartView("combined")}
                        className={`px-4 py-2 text-sm font-medium ${chartView === "combined" ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                    >
                        Combined
                    </button>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedHirerId(null)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${selectedHirerId === null ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                    >
                        All Hirers
                    </button>
                    {chartStats.map((h) => (
                        <button
                            key={h.hirerId}
                            onClick={() => setSelectedHirerId(
                                selectedHirerId === h.hirerId ? null : h.hirerId
                            )}
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${selectedHirerId === h.hirerId ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"}`}
                        >
                            {h.hirerName}
                        </button>
                    ))}
                </div>
            </div>

            {/*bar charts per venue*/}
            {chartView === "perVenue" && (
                <>
                    <h2 className="text-xl font-light tracking-tight text-gray-900 mb-4">
                        Per-Venue Breakdown
                        {selectedHirerId && (
                            <span className="ml-2 text-sm text-blue-500">
                                — {chartStats.find((h) => h.hirerId === selectedHirerId)?.hirerName}
                            </span>
                        )}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                        {filteredChartStats.map((hirer) => (
                            <div key={hirer.hirerId} className="border border-gray-200 rounded-xl p-4">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">{hirer.hirerName}</h3>
                                {hirer.venueBreakdown.length === 0 ? (
                                    <p className="text-xs text-gray-400">No applications yet.</p>
                                ) : (
                                    <ResponsiveContainer width="100%" height={200}>
                                        <BarChart data={hirer.venueBreakdown} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="venueName" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
                                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                                            <Tooltip />
                                            <Legend verticalAlign="top" />
                                            <Bar dataKey="approved" name="Approved" fill="#10b981" />
                                            <Bar dataKey="total" name="Total" fill="#93c5fd" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/*stacked bar chart */}
            {chartView === "combined" && (
                <>
                    <h2 className="text-xl font-light tracking-tight text-gray-900 mb-4">
                        Combined Totals
                        {selectedHirerId && (
                            <span className="ml-2 text-sm text-blue-500">
                                — {chartStats.find((h) => h.hirerId === selectedHirerId)?.hirerName}
                            </span>
                        )}
                    </h2>
                    <div className="border border-gray-200 rounded-xl p-4 mb-10">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stackedBarData} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} angle={-30} textAnchor="end" />
                                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend verticalAlign="top" />
                                <Bar dataKey="Approved" stackId="a" fill="#10b981" />
                                <Bar dataKey="Pending" stackId="a" fill="#fbbf24" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}

        </LayOut>
    );
}