import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '@/stores';
import { Provider as GameOfLibertyProvider } from '@/contexts/GameOfLiberty';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameOfLibertyProvider>
      <Component {...pageProps} />
    </GameOfLibertyProvider>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp));
