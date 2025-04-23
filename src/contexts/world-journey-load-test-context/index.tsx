import { createContext, useCallback, useMemo, useState, useEffect } from 'react';
import { WorldJourneyApi } from '@/adapters/apis/world-journey-api';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { ChangePlayerActionCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-action-command';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { WorldJourneyService } from '@/services/world-journey-service';

type ContextValue = {
  startLoadTest: (worldId: string) => void;
  endLoadTest: () => void;
};

const Context = createContext<ContextValue>({
  startLoadTest: () => {},
  endLoadTest: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function Provider({ children }: Props) {
  const [worldJourneyPairs, setWorldJourneyPairs] = useState<[WorldJourneyApi, WorldJourneyService][] | null>(null);

  useEffect(() => {
    if (!worldJourneyPairs) return () => {};

    const unsubscribers = worldJourneyPairs.map(([worldJourneyApi, worldJourneyService]) => {
      return worldJourneyService.subscribe('LOCAL_COMMAND_EXECUTED', (command) => {
        worldJourneyApi.sendCommand(command);
      });
    });

    const intervals = worldJourneyPairs.map(([, worldJourneyService]) => {
      return setInterval(() => {
        const randomDirection = DirectionVo.create(Math.floor(Math.random() * 4));

        const myPlayer = worldJourneyService.getMyPlayer();
        const playerAction = PlayerActionVo.newWalk(randomDirection);
        const command = ChangePlayerActionCommand.create(myPlayer.getId(), playerAction);
        worldJourneyService.executeLocalCommand(command);
      }, 200);
    });

    return () => {
      unsubscribers.forEach((unsub) => {
        unsub();
      });
      intervals.forEach((interval) => {
        clearInterval(interval);
      });
    };
  }, [worldJourneyPairs]);

  const endLoadTest = useCallback(() => {
    worldJourneyPairs?.forEach(([worldJourneyApi]) => {
      worldJourneyApi.disconnect();
    });
    setWorldJourneyPairs(null);
  }, [worldJourneyPairs]);

  const startLoadTest = useCallback(
    async (worldId: string) => {
      if (worldJourneyPairs) return;

      const newWorldJourneyPairs: [WorldJourneyApi, WorldJourneyService][] = await new Promise((resolve) => {
        const connectionCount = 10;
        const res: [WorldJourneyApi, WorldJourneyService][] = [];

        for (let i = 0; i < connectionCount; i += 1) {
          const worldJourneyApi = WorldJourneyApi.create(worldId, {
            onWorldEntered: (newWorldJourneyService) => {
              res.push([worldJourneyApi, newWorldJourneyService]);

              if (res.length === connectionCount) {
                resolve(res);
              }
            },
            onCommandReceived: () => {},
            onCommandFailed: () => {},
            onUnitsReturned: () => {},
            onErrored: () => {},
            onOpen: () => {},
            onDisconnect: () => {},
          });
        }
      });

      setWorldJourneyPairs(newWorldJourneyPairs);
    },
    [worldJourneyPairs]
  );

  const context = {
    startLoadTest,
    endLoadTest,
  };

  return <Context.Provider value={useMemo<ContextValue>(() => context, Object.values(context))}>{children}</Context.Provider>;
}

export { Provider as WorldJourneyServiceLoadTestProvider, Context as WorldJourneyServiceLoadTestContext };
