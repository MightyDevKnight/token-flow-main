import '../styles/globals.css'
import '../styles/figma.css';
import '../styles/figma-bridge.css';
import '../styles/main.css';
import '../styles/tailwind.css';
import '../styles/preflight.css';
import '../styles/spinner.css';

import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
