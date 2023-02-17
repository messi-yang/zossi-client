import './tailwind.css';
import type { AppProps } from 'next/app';
import { Provider as ThreeJsContextProvider } from '@/contexts/ThreeJsContext';
import { Provider as GameContextProvider } from '@/contexts/GameContext';
import { Provider as StyleContextProvider } from '@/contexts/StyleContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyleContextProvider>
      <ThreeJsContextProvider>
        <GameContextProvider>
          <Component {...pageProps} />
        </GameContextProvider>
      </ThreeJsContextProvider>
    </StyleContextProvider>
  );
}

export default MyApp;
