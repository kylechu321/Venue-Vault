import { HireRecord, ComplianceDocument } from "@/types/application";

function StarRating({ rating }: { rating: number }) {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className="flex gap-1 justify-center">
            {stars.map((star) => (
                <span
                    key={star}
                    className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                >
                    ★
                </span>
            ))}
        </div>
    );
}
function StatusBadge({ status }: { status: HireRecord["status"] }) {
    const styles = {
        completed: "bg-green-100 text-green-700 border border-green-400",
        cancelled: "bg-red-100 text-red-700 border border-red-400",
        "in-progress": "bg-blue-100 text-blue-700 border border-blue-400",
    };

    return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
}

function getScoreUI(score: number) {
    const rounded = Math.round(score);

    if (rounded >= 75) {
        return {
            rounded,
            color: "text-green-400",
            barColor: "bg-green-500",
            label: "Highly trusted hirer",
        };
    }

    if (rounded >= 50) {
        return {
            rounded,
            color: "text-yellow-400",
            barColor: "bg-yellow-500",
            label: "Moderately trusted hirer",
        };
    }

    return {
        rounded,
        color: "text-red-400",
        barColor: "bg-red-500",
        label: "Building credibility",
    };
}
// Displays credibility score
function CredibilityScore({ score }: { score: number }) {
    const scoreUI = getScoreUI(score);

    return (
        <div className="mb-6 rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-gray-700">Credibility Score</h2>
            <div className="flex items-center gap-4">
                <p className={`text-4xl font-bold ${scoreUI.color}`}>{scoreUI.rounded}%</p>
                <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className={`${scoreUI.barColor} h-3 rounded-full transition-all duration-500`}
                            style={{ width: `${scoreUI.rounded}%` }}
                        />
                    </div>
                    <p className="mt-1 text-xs text-gray-600">{scoreUI.label}</p>
                </div>
            </div>
        </div>
    );
}
// Displays document
function ComplianceDocumentCard({ doc }: { doc: ComplianceDocument }) {
    const badgeClass = doc.verified
        ? "bg-green-100 text-green-700 border border-green-400"
        : "bg-yellow-100 text-yellow-700 border border-yellow-400";

    return (
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="mt-1 text-xs text-gray-600">Uploaded: {doc.uploadedDate}</p>
                    <p className="text-xs text-gray-600">Expires: {doc.expiryDate}</p>
                    <p className="mt-1 text-xs capitalize text-gray-700">{doc.type}</p>
                    {doc.fileUrl && (
                        <p className="mt-1 text-xs text-gray-700">
                            <a
                                href={doc.fileUrl}
                                download={`${doc.type}-${doc.hirerId}`}
                                className="text-blue-700 underline hover:text-blue-800"
                            >
                                View Document
                            </a>
                        </p>
                    )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${badgeClass}`}>
                    {doc.verified ? "Verified" : "Pending"}
                </span>
            </div>
        </div>
    );
}
// Displays record
function HireRecordCard({ record }: { record: HireRecord }) {
    return (
        <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-medium text-gray-900">{record.eventName}</p>
                    <p className="text-sm text-gray-700">{record.venueName}</p>
                    <p className="text-sm text-gray-700">{record.vendorName}</p>
                    <p className="mt-1 text-xs text-gray-600">{record.eventDate}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <StatusBadge status={record.status} />
                    {record.rating !== undefined && <StarRating rating={record.rating} />}
                </div>
            </div>
        </div>
    );
}

export { StarRating, CredibilityScore, ComplianceDocumentCard, HireRecordCard };