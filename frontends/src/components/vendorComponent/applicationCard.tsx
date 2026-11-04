import { ComplianceDocument, Post } from "@/types/application";


//use the week 4 lecture
type ApplicationCardProps = {
    post: Post;
    reputation: number;
    credibilityStars: number;
    uploadedCount: number;
    complianceDocs: ComplianceDocument[];
    showActions: boolean;
    commentValue?: string;
    onCommentChange?: (value: string) => void;
    onViewProfile: (hirerId: number) => void;
    onApprove?: (postId: string) => void;
    onReject?: (postId: string) => void;
};

export default function ApplicationCard({
    post,
    reputation,
    credibilityStars,
    uploadedCount,
    complianceDocs,
    showActions,
    commentValue,
    onCommentChange,
    onViewProfile,
    onApprove,
    onReject,
}: ApplicationCardProps) {
    return (
        <div className="rounded-xl border border-gray-300 bg-white p-7 shadow-md">
            <h3 className="text-xl font-semibold text-gray-900">{post.venue}</h3>
            <p className="mt-1 mb-5 text-sm text-gray-600">{post.eventName}</p>
            <p className="text-gray-600 mb-2">
                <span className="font-medium">Guests:</span> {post.numGuests}
            </p>
            <p className="text-gray-600 mb-2">
                <span className="font-medium">Event Date:
                </span> {post.eventDate ? new Date(post.eventDate).toLocaleDateString() : "—"}
            </p>
            <p className="text-gray-600 mb-2">
                <span className="font-medium">Event Time:</span> {post.eventTime}
            </p>
            <p className="text-gray-600 mb-2">
                <span className="font-medium">Duration:</span> {post.eventDuration} hours
            </p>
            <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium text-gray-800">Reputation: </span>
                {"★".repeat(Math.round(reputation))}
                {"☆".repeat(5 - Math.round(reputation))} ({reputation.toFixed(1)})
            </p>
            <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium text-gray-800">Credibility: </span>
                {"★".repeat(credibilityStars)}
                {"☆".repeat(5 - credibilityStars)} ({credibilityStars}/5)
            </p>

            {!showActions && (
                <p className="text-xs text-gray-500 mb-4">Documents uploaded: {uploadedCount}/3</p>
            )}

            {post.comment && !showActions && (
                <p className="text-gray-600 mb-4 italic">
                    <span className="font-medium not-italic text-gray-300">Comment:</span> {post.comment}
                </p>
            )}

            <div className="text-xs text-gray-600 mb-4">
                <span>Posted by {post.hirerUsername}</span>
                <span className="mx-2">•</span>
                <span>{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "—"}</span>
            </div>

            <div className="mt-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => onViewProfile(Number(post.hirerId))}
                    className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-medium py-1 px-3 rounded"
                >
                    View Hirer Profile
                </button>
            </div>

            {showActions && (
    <>
        <div className="mt-4">
            {complianceDocs?.filter((doc) => Boolean(doc.fileUrl)).length ? (
                <p className="text-xs text-green-700">
                    Compliance documents are available in this user's profile.
                </p>
            ) : (
                <p className="text-xs text-gray-500">No compliance documents uploaded.</p>
            )}
        </div>
                    <div className="mt-4">
                        <label
                            htmlFor={`comment-${post.id}`}
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Comment
                        </label>
                        <textarea
                            id={`comment-${post.id}`}
                            name="comment"
                            placeholder="Write a comment here"
                            value={commentValue ?? ""}
                            onChange={(e) => onCommentChange?.(e.target.value)}
                            className="w-full min-h-30 rounded-md border border-gray-300 bg-white p-3 text-gray-900 placeholder:text-gray-400"
                        />
                    </div>
                    {/*week 2 example 5*/}
                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={() => onApprove?.(String(post.id))}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-4 rounded"
                        >
                            Approve
                        </button>
                        <button
                            type="button"
                            onClick={() => onReject?.(String(post.id))}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 px-4 rounded"
                        >
                            Reject
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
