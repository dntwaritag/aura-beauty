// pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>AURA — AI Beauty & Style Assistant</title>
        <meta name="description" content="AI-powered skin analysis, AR makeup try-on, and personalized beauty recommendations. Your beauty fingerprint, perfected." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="AURA — AI Beauty & Style Assistant" />
        <meta property="og:description" content="Skin analysis + AR try-on + personalized recommendations powered by Perfect Corp YouCam APIs." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#0A0A0A" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
