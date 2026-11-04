import "@/styles/globals.css";
import type {AppProps} from "next/app";
import { UseWebAuthGuard } from "@/components/webAuthGuard";

export default function App({Component, pageProps}: AppProps) {
    const isAuthorised = UseWebAuthGuard();

    if (!isAuthorised === null || isAuthorised === false) {
        return null;
    } else {
        return (
            <Component {...pageProps} />
        );
    }
}
