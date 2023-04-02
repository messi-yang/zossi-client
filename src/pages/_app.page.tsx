import './tailwind.css';
import type { AppProps } from 'next/app';
import { Provider as GameContextProvider } from '@/contexts/GameContext';
import { Provider as ItemContextProvider } from '@/contexts/ItemContext';
import { Provider as WorldContextProvider } from '@/contexts/WorldContext';
import { Provider as StyleContextProvider } from '@/contexts/StyleContext';
import { Provider as ThreeJsContextProvider } from '@/contexts/ThreeJsContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyleContextProvider>
      <ThreeJsContextProvider>
        <GameContextProvider>
          <ItemContextProvider>
            <WorldContextProvider>
              <Component {...pageProps} />
            </WorldContextProvider>
          </ItemContextProvider>
        </GameContextProvider>
      </ThreeJsContextProvider>
    </StyleContextProvider>
  );
}

export default MyApp;
