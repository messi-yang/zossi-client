import '@/styles/tailwind.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { wrapper } from '@/stores';
import { Provider as GameRoomProvider } from '@/contexts/GameRoom';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameRoomProvider>
      <Component {...pageProps} />
    </GameRoomProvider>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp));
