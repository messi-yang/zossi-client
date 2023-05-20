import './tailwind.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/auth-context';
import { GameProvider } from '@/contexts/game-context';
import { ItemProvider } from '@/contexts/item-context';
import { WorldProvider } from '@/contexts/world-context';
import { ThreeJsProvider } from '@/contexts/three-js-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThreeJsProvider>
        <GameProvider>
          <ItemProvider>
            <WorldProvider>
              <Component {...pageProps} />
            </WorldProvider>
          </ItemProvider>
        </GameProvider>
      </ThreeJsProvider>
    </AuthProvider>
  );
}

export default MyApp;
