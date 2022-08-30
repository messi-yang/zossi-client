import '@/styles/globals.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '@/stores';
import { Provider as GameRoomProvider } from '@/contexts/GameRoom';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameRoomProvider>
      <>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Silkscreen&display=swap" rel="stylesheet" />
        </Head>
        <Component {...pageProps} />
      </>
    </GameRoomProvider>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp));
