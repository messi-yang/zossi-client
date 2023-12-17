import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { UserApi } from '@/apis/user-api';
import { LocalStorage } from '@/storages/local-storage';
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
  const [userApi] = useState<UserApi>(() => UserApi.new());
  const [user, setUser] = useState<UserModel | null>(null);
  const [isUpdatingMyUser, setIsUpdatingMyUser] = useState(false);
  const [localStorage] = useState(() => LocalStorage.get());

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
    const accessToken = localStorage.getAccessToken();
    if (!accessToken) {
      return;
    }
    getMyUser();
  }, [localStorage.getAccessToken()]);

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
