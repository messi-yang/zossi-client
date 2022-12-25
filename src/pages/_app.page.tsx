import './tailwind.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { Provider as GameRoomProvider } from '@/contexts/GameContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameRoomProvider>
      <Component {...pageProps} />
    </GameRoomProvider>
  );
}

export default appWithTranslation(MyApp);
