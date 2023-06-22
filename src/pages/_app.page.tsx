import './tailwind.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@/contexts/user-context';
import { AuthProvider } from '@/contexts/auth-context';
import { WorldJourneyProvider } from '@/contexts/world-journey-context';
import { ItemProvider } from '@/contexts/item-context';
import { MyWorldsProvider } from '@/contexts/my-worlds-context';
import { ThreeJsProvider } from '@/contexts/three-js-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <ThreeJsProvider>
          <WorldJourneyProvider>
            <ItemProvider>
              <MyWorldsProvider>
                <Component {...pageProps} />
              </MyWorldsProvider>
            </ItemProvider>
          </WorldJourneyProvider>
        </ThreeJsProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default MyApp;
