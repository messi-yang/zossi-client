import './tailwind.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/contexts/auth-context';
import { GameProvider } from '@/contexts/game-context';
import { ItemProvider } from '@/contexts/item-context';
import { QueryWorldsProvider } from '@/contexts/query-worlds-context';
import { ThreeJsProvider } from '@/contexts/three-js-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThreeJsProvider>
        <GameProvider>
          <ItemProvider>
            <QueryWorldsProvider>
              <Component {...pageProps} />
            </QueryWorldsProvider>
          </ItemProvider>
        </GameProvider>
      </ThreeJsProvider>
    </AuthProvider>
  );
}

export default MyApp;
