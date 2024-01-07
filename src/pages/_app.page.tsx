import './tailwind.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@/contexts/user-context';
import { AuthProvider } from '@/contexts/auth-context';
import { WorldJourneyProvider } from '@/contexts/world-journey-context';
import { MyWorldsProvider } from '@/contexts/my-worlds-context';
import { WorldMembersProvider } from '@/contexts/world-members-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <WorldJourneyProvider>
          <MyWorldsProvider>
            <WorldMembersProvider>
              <Component {...pageProps} />
            </WorldMembersProvider>
          </MyWorldsProvider>
        </WorldJourneyProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default MyApp;
