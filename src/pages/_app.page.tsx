import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '@/stores';
import { Provider as GameSocketContextProvider } from '@/contexts/GameSocket';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameSocketContextProvider>
      <Component {...pageProps} />
    </GameSocketContextProvider>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp));
