import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { UserApi } from '@/adapters/apis/user-api';
import { AuthSessionStorage } from '@/adapters/storages/auth-session-storage';
import { UserModel } from '@/models/iam/user-model';

type ContextValue = {
  user: UserModel | null;
  getMyUser: () => void;
  updateMyUser: (username: string, friendlyName: string) => void;
  isUpdatingMyUser: boolean;
};

function createInitialContextValue(): ContextValue {
  return {
    user: null,
    getMyUser: () => {},
    updateMyUser: () => {},
    isUpdatingMyUser: false,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [userApi] = useState<UserApi>(() => UserApi.create());
  const [user, setUser] = useState<UserModel | null>(null);
  const [isUpdatingMyUser, setIsUpdatingMyUser] = useState(false);
  const [authSessionStorage] = useState(() => AuthSessionStorage.get());

  const getMyUser = useCallback(async () => {
    const returnedUser = await userApi.getMyUser();
    setUser(returnedUser);
  }, []);

  const updateMyUser = useCallback(
    async (username: string, friendlyName: string) => {
      if (isUpdatingMyUser) return;

      try {
        setIsUpdatingMyUser(true);

        const updatedUser = await userApi.updateMyUser(username, friendlyName);
        setUser(updatedUser);
      } finally {
        setIsUpdatingMyUser(false);
      }
    },
    [isUpdatingMyUser]
  );

  useEffect(() => {
    const accessToken = authSessionStorage.getAccessToken();
    if (!accessToken) {
      return;
    }
    getMyUser();
  }, [authSessionStorage.getAccessToken()]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          user,
          getMyUser,
          updateMyUser,
          isUpdatingMyUser,
        }),
        [user, getMyUser, updateMyUser, isUpdatingMyUser]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as UserProvider, Context as UserContext };
