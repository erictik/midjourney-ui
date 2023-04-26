import '../public/antd.min.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import MainLayout from '../layouts/main'

export default function App({ Component, pageProps }: AppProps) {
  return (
    < MainLayout>
      <Component {...pageProps} />
    </MainLayout>
  );
}
