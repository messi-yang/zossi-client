import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { UserApiService } from '@/apis/services/user-api-service';
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
  const [userApiService] = useState<UserApiService>(() => UserApiService.new());
  const [user, setUser] = useState<UserModel | null>(null);
  const [isUpdatingMyUser, setIsUpdatingMyUser] = useState(false);
  const [localStorage] = useState(() => LocalStorage.get());

  const getMyUser = useCallback(async () => {
    const returnedUser = await userApiService.getMyUser();
    setUser(returnedUser);
  }, []);

  const updateMyUser = useCallback(
    async (username: string, friendlyName: string) => {
      if (isUpdatingMyUser) return;

      try {
        setIsUpdatingMyUser(true);

        const updatedUser = await userApiService.updateMyUser(username, friendlyName);
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
