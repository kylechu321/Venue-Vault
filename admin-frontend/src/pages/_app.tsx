import "@/styles/globals.css";
import type {AppProps} from "next/app";
import { UseAdminAuthGuard } from "@/components/webAuthGuard";
import { useRouter } from "next/router";

export default function App({Component, pageProps}: AppProps) {
  const router = useRouter();
  const isAuthorised = UseAdminAuthGuard();

  // Allow admin sign in page to render without auth check
  if (router.pathname === "/auth/signin") {
    return <Component {...pageProps} />;
  }

  if (isAuthorised === null || isAuthorised === false) {
    return null;
  }

  return <Component {...pageProps} />;
}
