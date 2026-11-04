import { LayOut } from "@/components/layouts/layOut";
import Link from "next/link";

export default function Home() {
    return (
        <LayOut>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
                <h1 id="heading" className="mb-6">Welcome Admin</h1>
                <Link
                    href="/dashboard"
                    className="bg-blue-500 px-6 py-2 rounded hover:bg-blue-600 text-white text-sm font-medium"
                >
                    Go to Dashboard
                </Link>
            </div>
        </LayOut>
    );
}