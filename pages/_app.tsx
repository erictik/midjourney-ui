
import type { AppProps } from 'next/app';
import MainLayout from '../layouts/main'
import '../public/antd.min.css';
import '../styles/globals.css'
import withTheme from '../theme';
export default function App({ Component, pageProps }: AppProps) {
  return withTheme(
    MainLayout( <Component {...pageProps} />)
  );
}
