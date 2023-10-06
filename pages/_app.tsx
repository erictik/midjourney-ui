import type { AppProps } from "next/app";
import MainLayout from "../layouts/main";
import "../public/antd.min.css";
import "../styles/globals.css";
import withTheme from "../theme";
import { Analytics } from "@vercel/analytics/react";
import { AuthContextProvider } from "../stores/authContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const useMainLayout = router.pathname !== "/";

  return withTheme(
    <AuthContextProvider>
      {useMainLayout ? (
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      ) : (
        <Component {...pageProps} />
      )}
      {!!process.env.VERCEL ? <Analytics /> : null}
    </AuthContextProvider>
  );
}
