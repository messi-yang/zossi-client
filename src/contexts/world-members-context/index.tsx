import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldMemberApi } from '@/adapters/apis/world-member-api';
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
  children: React.ReactNode;
};

function Provider({ children }: Props) {
  const [worldMemberApi] = useState<WorldMemberApi>(() => WorldMemberApi.create());
  const [worldMembers, setWorldMembers] = useState<WorldMemberModel[] | null>(null);

  const getWorldMembers = useCallback(async (worldId: string) => {
    const returnedWorldMembers = await worldMemberApi.getWorldMembers(worldId);
    setWorldMembers(returnedWorldMembers);
  }, []);

  return (
    <Context.Provider value={useMemo<ContextValue>(() => ({ getWorldMembers, worldMembers }), [getWorldMembers, worldMembers])}>
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldMembersProvider, Context as WorldMembersContext };
