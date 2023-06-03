import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { UserApiService } from '@/api-services/user-api-service';
import { UserModel } from '@/models';

type ContextValue = {
  user: UserModel | null;
  getMyUser: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    user: null,
    getMyUser: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [userApiService] = useState<UserApiService>(() => UserApiService.new());
  const [user, setUer] = useState<UserModel | null>(null);

  const getMyUser = useCallback(async () => {
    const returnedUser = await userApiService.getMyUser();
    setUer(returnedUser);
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      return;
    }
    getMyUser();
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          user,
          getMyUser,
        }),
        [user, getMyUser]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as UserProvider, Context as UserContext };
