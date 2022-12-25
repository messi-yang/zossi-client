import './tailwind.css';
import type { AppProps } from 'next/app';
import { Provider as GameRoomProvider } from '@/ui/contexts/GameContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameRoomProvider>
      <Component {...pageProps} />
    </GameRoomProvider>
  );
}

export default MyApp;
