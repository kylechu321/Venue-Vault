import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export function UseAdminAuthGuard() {
    const router = useRouter();
    const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

    useEffect(() => {
        const storedAdmin = localStorage.getItem("loggedInAdmin");
        if (storedAdmin) {
            try {
                const parsed = JSON.parse(storedAdmin);
                if (parsed && parsed.role === "admin") {
                    setIsAuthorised(true);
                    return;
                }
            } catch {
                localStorage.removeItem("loggedInAdmin");
            }
        }

        setIsAuthorised(false);
        router.push("/auth/signin");
    }, [router.pathname]);

    return isAuthorised;
}