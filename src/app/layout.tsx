'use client';

import './tailwind.css';
import { UserProvider } from '@/contexts/user-context';
import { AuthProvider } from '@/contexts/auth-context';
import { WorldJourneyServiceProvider } from '@/contexts/world-journey-service-context';
import { MyWorldsProvider } from '@/contexts/my-worlds-context';
import { WorldMembersProvider } from '@/contexts/world-members-context';
import { NotificationProvider } from '@/contexts/notification-context';
import { WorldJourneyServiceLoadTestProvider } from '@/contexts/world-journey-load-test-context';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Exo+2&display=swap" rel="stylesheet" />
      </head>
      <body>
        <NotificationProvider>
          <UserProvider>
            <AuthProvider>
              <WorldJourneyServiceLoadTestProvider>
                <WorldJourneyServiceProvider>
                  <MyWorldsProvider>
                    <WorldMembersProvider>{children}</WorldMembersProvider>
                  </MyWorldsProvider>
                </WorldJourneyServiceProvider>
              </WorldJourneyServiceLoadTestProvider>
            </AuthProvider>
          </UserProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
