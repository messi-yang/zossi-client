import '@/styles/tailwind.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Provider as GameRoomProvider } from '@/contexts/GameRoom';
import { Provider as ItemContextProvider } from '@/contexts/ItemContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ItemContextProvider>
      <GameRoomProvider>
        <Component {...pageProps} />
      </GameRoomProvider>
    </ItemContextProvider>
  );
}

export default appWithTranslation(MyApp);
