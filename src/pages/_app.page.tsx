import './tailwind.css';
import type { AppProps } from 'next/app';
import { UserProvider } from '@/contexts/user-context';
import { AuthProvider } from '@/contexts/auth-context';
import { WorldJourneyServiceProvider } from '@/contexts/world-journey-service-context';
import { MyWorldsProvider } from '@/contexts/my-worlds-context';
import { WorldMembersProvider } from '@/contexts/world-members-context';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <AuthProvider>
        <WorldJourneyServiceProvider>
          <MyWorldsProvider>
            <WorldMembersProvider>
              <Component {...pageProps} />
            </WorldMembersProvider>
          </MyWorldsProvider>
        </WorldJourneyServiceProvider>
      </AuthProvider>
    </UserProvider>
  );
}

export default MyApp;
