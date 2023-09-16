import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldMemberApiService } from '@/services/api-services/world-member-api-service';
import { WorldMemberModel } from '@/models/iam/world-member-model';

type ContextValue = {
  getWorldMembers: (worldId: string) => Promise<void>;
  worldMembers: WorldMemberModel[] | null;
};

function createInitialContextValue(): ContextValue {
  return {
    getWorldMembers: async () => {},
    worldMembers: null,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [worldMemberApiService] = useState<WorldMemberApiService>(() => WorldMemberApiService.new());
  const [worldMembers, setWorldMembers] = useState<WorldMemberModel[] | null>(null);

  const getWorldMembers = useCallback(async (worldId: string) => {
    const returnedWorldMembers = await worldMemberApiService.getWorldMembers(worldId);
    setWorldMembers(returnedWorldMembers);
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(() => ({ getWorldMembers, worldMembers }), [getWorldMembers, worldMembers])}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldMembersProvider, Context as WorldMembersContext };
