'use client';

import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthApi } from '@/adapters/apis/auth-api';
import { AuthSessionStorage } from '@/adapters/storages/auth-session-storage';
import { AuthenticationEventDispatcher } from '@/event-dispatchers/authentication-event-dispatcher';

type ContextValue = {
  isSingedIn: boolean;
  setOauthClientRedirectPath: (path: string) => void;
  startGoogleOauthFlow: () => void;
  signIn: (accessToken: string) => void;
  signOut: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    isSingedIn: false,
    setOauthClientRedirectPath: () => {},
    startGoogleOauthFlow: () => {},
    signIn: () => {},
    signOut: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: React.ReactNode;
};

function Provider({ children }: Props) {
  const [authenticationEventDispatcher] = useState(() => AuthenticationEventDispatcher.create());
  const [authApi] = useState<AuthApi>(() => AuthApi.create());
  const [authSessionStorage] = useState(() => AuthSessionStorage.get());
  const router = useRouter();

  const [clientRedirectPath, setClientRedirectPath] = useState('/dashboard/worlds');
  const setOauthClientRedirectPath = useCallback((path: string) => {
    setClientRedirectPath(path);
  }, []);

  const [isSingedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const accessToken = authSessionStorage.getAccessToken();
    if (accessToken) {
      setIsSignedIn(true);
    }
  }, [authSessionStorage]);

  const startGoogleOauthFlow = useCallback(() => {
    authApi.startGoogleOauthFlow(clientRedirectPath);
  }, [clientRedirectPath]);

  const signIn = useCallback(
    (accessToken: string) => {
      authSessionStorage.setAccessToken(accessToken);
      setIsSignedIn(true);
    },
    [authSessionStorage]
  );

  const signOut = useCallback(async () => {
    authSessionStorage.removeAccessToken();

    await router.push('/');
    window.location.reload();
  }, [authSessionStorage]);

  useEffect(() => {
    const unauthenticatedEventHandler = () => {
      setIsSignedIn(false);
      setClientRedirectPath(router.asPath);
      router.push('/auth/sign-in');
    };

    const unsubscribe = authenticationEventDispatcher.subscribeUnauthenticatedEvent(() => {
      unauthenticatedEventHandler();
    });

    return () => {
      unsubscribe();
    };
  }, [router]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          isSingedIn,
          setOauthClientRedirectPath,
          startGoogleOauthFlow,
          signIn,
          signOut,
        }),
        [isSingedIn, setOauthClientRedirectPath, startGoogleOauthFlow, signIn, signOut]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as AuthProvider, Context as AuthContext };
