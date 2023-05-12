import './tailwind.css';
import type { AppProps } from 'next/app';
import { GameProvider } from '@/contexts/game-context';
import { ItemProvider } from '@/contexts/item-context';
import { WorldProvider } from '@/contexts/world-context';
import { StyleProvider } from '@/contexts/style-context';
import { Provider as ThreeJsContextProvider } from '@/contexts/ThreeJsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyleProvider>
      <ThreeJsContextProvider>
        <GameProvider>
          <ItemProvider>
            <WorldProvider>
              <Component {...pageProps} />
            </WorldProvider>
          </ItemProvider>
        </GameProvider>
      </ThreeJsContextProvider>
    </StyleProvider>
  );
}

export default MyApp;
