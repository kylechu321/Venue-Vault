import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { LoggedInUser } from "@/types/user";

export function UseWebAuthGuard() {
    const router = useRouter();
    const publicPages = ["/", "/auth/signIn", "/auth/register"];
    const [isAuthorised, setIsAuthorised] = useState<boolean | null>(null);

    useEffect(() => {
        if (publicPages.includes(router.pathname)) {
            setIsAuthorised(true);
            return;
        }

        const storedUser = localStorage.getItem("loggedInUser");
        if (!storedUser) {
            setIsAuthorised(false);
            router.push("/auth/signIn");
            return;
        }

        try {
            const parsed = JSON.parse(storedUser) as LoggedInUser;
            const role = parsed?.role;

            if (!parsed?.firstName || (role !== "hirer" && role !== "vendor")) {
                localStorage.removeItem("loggedInUser");
                setIsAuthorised(false);
                router.push("/auth/signIn");
                return;
            }

            const isHirerPage = router.pathname.startsWith("/hirer");
            const isVendorPage = router.pathname.startsWith("/vendor");

            if (isHirerPage && role !== "hirer") {
                setIsAuthorised(false);
                router.push("/vendor");
                return;
            }

            if (isVendorPage && role !== "vendor") {
                setIsAuthorised(false);
                router.push("/hirer");
                return;
            }

            setIsAuthorised(true);
        } catch {
            localStorage.removeItem("loggedInUser");
            setIsAuthorised(false);
            router.push("/auth/signIn");
        }
    }, [router.pathname]);

    return isAuthorised;

}