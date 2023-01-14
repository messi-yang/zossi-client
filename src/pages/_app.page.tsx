import './tailwind.css';
import type { AppProps } from 'next/app';
import { Provider as GameContextProvider } from '@/contexts/GameContext';
import { Provider as StyleContextProvider } from '@/contexts/StyleContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GameContextProvider>
      <StyleContextProvider>
        <Component {...pageProps} />
      </StyleContextProvider>
    </GameContextProvider>
  );
}

export default MyApp;
