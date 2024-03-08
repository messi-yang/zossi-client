import { useEffect, useRef, useMemo, useCallback } from 'react';

import { PlayerModel } from '@/models/world/player/player-model';
import { useDomRect } from '@/hooks/use-dom-rect';

import { dataTestids } from './data-test-ids';
import { WorldJourneyService } from '@/services/world-journey-service';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { WorldRenderer } from './world-renderer';
import { PositionVo } from '@/models/world/common/position-vo';

type Props = {
  worldJourneyService: WorldJourneyService;
};

export function WorldCanvas({ worldJourneyService }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const worldRenderer = useMemo(() => WorldRenderer.new(worldJourneyService.getWorldBound()), [worldJourneyService]);
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
        if (animateCount % 600 === 0) worldRenderer.printRendererInfomation();
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
      return worldJourneyService.getUnit(position);
    },
    [worldJourneyService]
  );

  useEffect(() => {
    return worldRenderer.subscribeItemModelsDownloadedEvent((itemId) => {
      const item = worldJourneyService.getItem(itemId);
      if (!item) return;
      worldRenderer.updateUnitsOfItem(item, worldJourneyService.getUnitsOfItem(itemId), getUnit);
    });
  }, [worldJourneyService, worldRenderer, getUnit]);

  useEffect(() => {
    return worldJourneyService.subscribeItemAdded((item) => {
      worldRenderer.downloadItemModels(item);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribeUnitsChanged((itemId, units) => {
      const item = worldJourneyService.getItem(itemId);
      if (!item) return;
      worldRenderer.updateUnitsOfItem(item, units, getUnit);
    });
  }, [worldJourneyService, worldRenderer, getUnit]);

  useEffect(() => {
    return worldJourneyService.subscribePerspectiveChanged(
      (perspectiveDepth: number, targetPrecisePos: PrecisePositionVo) => {
        worldRenderer.updateCameraPosition(perspectiveDepth, targetPrecisePos);
      }
    );
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldRenderer.subscribePlayerModelDownloadedEvent(() => {
      worldRenderer.updatePlayers(worldJourneyService.getPlayers());
    });
  }, [worldRenderer, worldJourneyService]);

  useEffect(() => {
    return worldRenderer.subscribeDefaultFontDownloadedEvent(() => {
      Object.entries(worldJourneyService.getAllUnitsByItemId()).forEach(([itemId, units]) => {
        const item = worldJourneyService.getItem(itemId);
        if (!item) return;
        worldRenderer.updateUnitsOfItem(item, units, getUnit);
      });
    });
  }, [worldRenderer, worldJourneyService]);

  useEffect(() => {
    return worldRenderer.subscribeDefaultFontDownloadedEvent(() => {
      worldRenderer.updatePlayerNames(worldJourneyService.getPlayers());
    });
  }, [worldRenderer, worldJourneyService]);

  useEffect(() => {
    return worldJourneyService.subscribePlayersChanged((_, players: PlayerModel[]) => {
      worldRenderer.updatePlayers(players);
      worldRenderer.updatePlayerNames(players);
    });
  }, [worldRenderer, worldJourneyService]);

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}
