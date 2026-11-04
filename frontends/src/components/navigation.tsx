import Link from "next/link";
import {useState, useEffect} from "react";
import {useRouter} from "next/router";

export default function Navigation() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setCurrentUser] = useState<{
        firstName: string;
        lastName: string;
        role: string } | null>(null);

    const [homeHref, setHomeHref] = useState("/");

    const getHomeHref = (role: string) => {
        if (role === "hirer") {
            return "/hirer";
        }
        if (role === "vendor") {
            return "/vendor";
        }
        return "/";
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("loggedInUser");

        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);

                if (!parsed) {
                    localStorage.removeItem("loggedInUser");
                    setIsLoggedIn(false);
                    return;
                }

                setIsLoggedIn(true);
                setCurrentUser({
                    firstName: parsed.firstName,
                    lastName: parsed.lastName,
                    role: parsed.role,
                });
                setHomeHref(getHomeHref(parsed.role));

                const publicPages = ["/", "/auth/signIn", "/auth/register"];
                if (publicPages.includes(router.pathname)) {
                    router.push(getHomeHref(parsed.role));
                }
            } catch {
                // corrupted value — clear and treat as logged out
                localStorage.removeItem("loggedInUser");
                setIsLoggedIn(false);
            }
        } else {
            setIsLoggedIn(false);
        }


        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "loggedInUser") {
                if (e.newValue && e.newValue !== "null") {
                    // Another tab logged in — redirect this tab too
                    setIsLoggedIn(true);
                    const user = JSON.parse(e.newValue);
                    setHomeHref(getHomeHref(user.role));
                    if (user.role === "hirer") {
                        router.push("/hirer");
                    } else if (user.role === "vendor") {
                        router.push("/vendor");
                    }
                } else {
                    // Another tab logged out
                    setIsLoggedIn(false);
                    setHomeHref("/");
                    router.push("/auth/signIn");
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);

        // cleanup listener when component unmounts
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const handleSignOut = () => {
        localStorage.removeItem("loggedInUser");
        setIsLoggedIn(false);
        setHomeHref("/");
        router.push("/auth/signIn");
    };

    return (
        <nav className="w-full bg-gray-300 text-gray-800 p-4 border-b border-gray-400">
            <div className="container mx-auto flex justify-between items-center">
                <Link href={homeHref} className="text-xl font-bold text-gray-800 hover:text-gray-700">
                    Venue Vendors
                </Link>
                <div className="flex gap-2">
                    {isLoggedIn ? (
                        <>
                            {loggedInUser && (
                                <p className="text-sm text-gray-700 mb-2">
                                    Welcome,{" "}
                                    {loggedInUser.role === "hirer" ? (
                                        <Link
                                            href="/hirer/profile"
                                            className="font-semibold text-gray-800 hover:underline"
                                        >
                                            {loggedInUser.firstName} {loggedInUser.lastName}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold text-gray-800">
                                            {loggedInUser.firstName} {loggedInUser.lastName}
                                        </span>
                                    )}
                                </p>
                            )}

                            <button
                                onClick={handleSignOut}
                                className="bg-gray-400 px-4 py-2 rounded text-gray-800 hover:bg-gray-500"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/auth/signIn"
                                className="bg-gray-400 px-4 py-2 rounded text-gray-800 hover:bg-gray-500"
                            >
                                Login
                            </Link>
                            <Link
                                href="/auth/register"
                                className="bg-gray-400 px-4 py-2 rounded text-gray-800 hover:bg-gray-500"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}