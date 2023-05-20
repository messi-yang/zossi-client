import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { AuthService } from '@/apis/services/auth-service';

type ContextValue = {
  singedIn: boolean;
  goToGoogleOauthPage: () => void;
  signin: (accessToken: string) => void;
};

function createInitialContextValue(): ContextValue {
  return {
    singedIn: false,
    goToGoogleOauthPage: () => {},
    signin: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [authService] = useState<AuthService>(() => AuthService.new());

  const [singedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      setLoggedIn(true);
    }
  }, []);

  const goToGoogleOauthPage = useCallback(() => {
    authService.goToGoogleOauthPage();
  }, []);

  const signin = useCallback((accessToken: string) => {
    localStorage.setItem('access_token', accessToken);
    setLoggedIn(true);
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          singedIn,
          goToGoogleOauthPage,
          signin,
        }),
        [singedIn, goToGoogleOauthPage, signin]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as AuthProvider, Context as AuthContext };
