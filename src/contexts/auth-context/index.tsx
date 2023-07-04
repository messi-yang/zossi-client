import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthApiService } from '@/api-services/auth-api-service';
import { LocalStorage } from '@/storages/local-storage';
import { AuthEvent } from '@/events/auth-event';

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
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [authApiService] = useState<AuthApiService>(() => AuthApiService.new());
  const [localStorage] = useState(() => LocalStorage.get());
  const router = useRouter();

  const [clientRedirectPath, setClientRedirectPath] = useState('/dashboard/worlds');
  const setOauthClientRedirectPath = useCallback((path: string) => {
    setClientRedirectPath(path);
  }, []);

  const [isSingedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getAccessToken();
    if (accessToken) {
      setIsSignedIn(true);
    }
  }, [localStorage]);

  const startGoogleOauthFlow = useCallback(() => {
    authApiService.startGoogleOauthFlow(clientRedirectPath);
  }, [clientRedirectPath]);

  const signIn = useCallback(
    (accessToken: string) => {
      localStorage.setAccessToken(accessToken);
      setIsSignedIn(true);
    },
    [localStorage]
  );

  const signOut = useCallback(async () => {
    localStorage.removeAccessToken();

    await router.push('/');
    window.location.reload();
  }, [localStorage]);

  useEffect(() => {
    const unauthorizeHandler = () => {
      setIsSignedIn(false);
      setClientRedirectPath(router.asPath);
      router.push('/auth/sign-in');
    };
    window.addEventListener(AuthEvent.Unauthorized, unauthorizeHandler);

    return () => {
      window.removeEventListener(AuthEvent.Unauthorized, unauthorizeHandler);
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
