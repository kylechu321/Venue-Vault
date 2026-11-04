import {PropsWithChildren} from "react";
import Navigation from "@/components/navigation";
import {useRouter} from "next/router";
import FooterArea from "@/components/footer";
import {Geist, Geist_Mono} from "next/font/google";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});
const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"]});

function LayOut({children}: PropsWithChildren) {
    const router = useRouter();

    return (
        // layout used for placement pages
        <div id="placement"
             className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen flex flex-col`}>
            <Navigation key={router.pathname}/>
            <main className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-0 py-10">
                {children}
            </main>
            <FooterArea/>
        </div>
    )
}

export {LayOut};