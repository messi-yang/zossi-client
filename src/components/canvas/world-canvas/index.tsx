import { useEffect, useRef, useMemo, useCallback } from 'react';

import { PlayerModel } from '@/models/world/player/player-model';
import { useDomRect } from '@/hooks/use-dom-rect';

import { dataTestids } from './data-test-ids';
import { WorldJourney } from '@/logics/world-journey';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { WorldRenderer } from './world-renderer';
import { PositionVo } from '@/models/world/common/position-vo';

type Props = {
  worldJourney: WorldJourney;
};

export function WorldCanvas({ worldJourney }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const worldRenderer = useMemo(() => WorldRenderer.new(worldJourney.getWorldBound()), [worldJourney]);
  useEffect(() => {
    if (!wrapperRef.current) return () => {};

    worldRenderer.mount(wrapperRef.current);

    return () => {
      if (!wrapperRef.current) return;

      worldRenderer.destroy(wrapperRef.current);
    };
  }, [worldRenderer, wrapperRef.current]);

  useEffect(() => {
    if (!wrapperDomRect) return;

    worldRenderer.updateCanvasSize(wrapperDomRect.width, wrapperDomRect.height);
  }, [wrapperDomRect, worldRenderer]);

  useEffect(() => {
    const maxFps = 60;
    const frameDelay = 1000 / maxFps;
    let lastFrameTime = 0;
    let animateCount = 0;
    let animateId: number | null = null;

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - lastFrameTime;
      if (elapsed > frameDelay) {
        if (animateCount % 600 === 0)
          console.log(`Render Information: ${JSON.stringify(worldRenderer.getRenderer().info.render)}`);
        lastFrameTime = currentTime - (elapsed % frameDelay);
        worldRenderer.render();
        animateCount += 1;
      }
      animateId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animateId) {
        cancelAnimationFrame(animateId);
      }
    };
  }, [worldRenderer]);

  const getUnit = useCallback(
    (position: PositionVo) => {
      return worldJourney.getUnit(position);
    },
    [worldJourney]
  );

  useEffect(() => {
    return worldRenderer.subscribeItemModelsDownloadedEvent((itemId) => {
      const item = worldJourney.getItem(itemId);
      if (!item) return;
      worldRenderer.updateUnitsOfItem(item, worldJourney.getUnitsOfItem(itemId), getUnit);
    });
  }, [worldJourney, worldRenderer, getUnit]);

  useEffect(() => {
    return worldJourney.subscribeItemAdded((item) => {
      worldRenderer.downloadItemModels(item);
    });
  }, [worldJourney, worldRenderer]);

  useEffect(() => {
    return worldJourney.subscribeUnitsChanged((itemId, units) => {
      const item = worldJourney.getItem(itemId);
      if (!item) return;
      worldRenderer.updateUnitsOfItem(item, units, getUnit);
    });
  }, [worldJourney, worldRenderer, getUnit]);

  useEffect(() => {
    return worldJourney.subscribeMyPlayerChanged((_, newMyPlayer) => {
      worldRenderer.updateDirectionalLightPosition(newMyPlayer.getPosition());
    });
  }, [worldJourney, worldRenderer]);

  useEffect(() => {
    return worldJourney.subscribePerspectiveChanged((perspectiveDepth: number, targetPrecisePos: PrecisePositionVo) => {
      worldRenderer.updateCameraPosition(perspectiveDepth, targetPrecisePos);
    });
  }, [worldJourney, worldRenderer]);

  useEffect(() => {
    return worldRenderer.subscribePlayerModelDownloadedEvent(() => {
      worldRenderer.updatePlayers(worldJourney.getPlayers());
    });
  }, [worldRenderer, worldJourney]);

  useEffect(() => {
    return worldRenderer.subscribePlayerNameFontDownloadedEvent(() => {
      worldRenderer.updatePlayerNames(worldJourney.getPlayers());
    });
  }, [worldRenderer, worldJourney]);

  useEffect(() => {
    return worldJourney.subscribePlayersChanged((_, players: PlayerModel[]) => {
      worldRenderer.updatePlayers(players);
      worldRenderer.updatePlayerNames(players);
    });
  }, [worldRenderer, worldJourney]);

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}
