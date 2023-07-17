import './tailwind.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@/contexts/user-context';
import { AuthProvider } from '@/contexts/auth-context';
import { WorldJourneyProvider } from '@/contexts/world-journey-context';
import { MyWorldsProvider } from '@/contexts/my-worlds-context';
import { TjsProvider } from '@/contexts/tjs-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <TjsProvider>
          <WorldJourneyProvider>
            <MyWorldsProvider>
              <Component {...pageProps} />
            </MyWorldsProvider>
          </WorldJourneyProvider>
        </TjsProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default MyApp;
