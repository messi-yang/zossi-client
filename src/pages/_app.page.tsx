import './tailwind.css';
import type { AppProps } from 'next/app';
import { Provider as GameContextProvider } from '@/ui/contexts/GameContext';
import { Provider as StyleContextProvider } from '@/ui/contexts/StyleContext';

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
