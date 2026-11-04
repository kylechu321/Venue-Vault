import {PropsWithChildren} from "react";
import {Geist, Geist_Mono} from "next/font/google";

const geistSans = Geist({variable: "--font-geist-sans", subsets: ["latin"]});
const geistMono = Geist_Mono({variable: "--font-geist-mono", subsets: ["latin"]});

function SignAndSignOutLayout({children}: PropsWithChildren) {
    // Used for both sign in and sign out pages as they have the same layout
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen flex flex-col text-gray-900`}>
            <main className="flex-1 flex items-center justify-center w-full">
                {children}
            </main>
        </div>
    )
}

export { SignAndSignOutLayout };