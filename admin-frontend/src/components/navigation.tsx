import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Navigation() {

    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInAdmin, setCurrentUser] = useState<{
        role: string;
        username: string;
    } | null>(null);

    const handleSignOut = () => {
        localStorage.removeItem("loggedInAdmin");
        setIsLoggedIn(false);
        router.push("/auth/signin");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInAdmin");

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);

                if (!parsed) {
                    localStorage.removeItem("loggedInAdmin");
                    setIsLoggedIn(false);
                    return;
                }

                setIsLoggedIn(true);
                setCurrentUser({
                    role: parsed.role,
                    username: parsed.username,
                });
            } catch {
                localStorage.removeItem("loggedInAdmin");
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, [router.pathname]);

    return (
        <nav className="w-full bg-gray-800 text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold hover:underline">
                    Admin Dashboard
                </Link>
                <ul className="flex space-x-5 items-center">
                    <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                    {isLoggedIn ? (
                        <li>
                            <button onClick={handleSignOut} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600">
                                Sign Out
                            </button>
                        </li>
                    ) : (
                        <li><a href="/auth/signin" className="hover:underline">Sign In</a></li>
                    )}
                </ul>
            </div>
        </nav>
    );
}