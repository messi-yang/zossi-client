import { useEffect, useMemo, useCallback, useState } from 'react';

import { useDomRect } from '@/hooks/use-dom-rect';

import { dataTestids } from './data-test-ids';
import { WorldJourneyService } from '@/services/world-journey-service';
import { WorldRenderer } from './world-renderer';
import { PositionVo } from '@/models/world/common/position-vo';

type Props = {
  worldJourneyService: WorldJourneyService;
};

export function WorldCanvas({ worldJourneyService }: Props): JSX.Element {
  const [wrapperDom, setWrapperDom] = useState<HTMLDivElement | null>(null);
  const wrapperDomRect = useDomRect(wrapperDom);
  const worldRenderer = useMemo(() => WorldRenderer.create(), [worldJourneyService]);
  useEffect(() => {
    if (!wrapperDom) return () => {};

    worldRenderer.mount(wrapperDom);

    return () => {
      if (!wrapperDom) return;

      worldRenderer.destroy(wrapperDom);
    };
  }, [worldRenderer, wrapperDom, worldJourneyService]);

  useEffect(() => {
    worldRenderer.updateCanvasSize(wrapperDomRect?.width || 0, wrapperDomRect?.height || 0);
  }, [wrapperDomRect, worldRenderer]);

  const [hasDownloadedPlayerModel, setHasDownloadedPlayerModel] = useState(false);
  useEffect(() => {
    return worldRenderer.subscribePlayerModelDownloadedEvent(() => {
      setHasDownloadedPlayerModel(true);
    });
  }, [worldRenderer]);

  const [hasDownloadedFont, setHasDownloadedFont] = useState(false);
  useEffect(() => {
    return worldRenderer.subscribeDefaultFontDownloadedEvent(() => {
      setHasDownloadedFont(true);
    });
  }, [worldRenderer]);

  useEffect(() => {}, [hasDownloadedPlayerModel, hasDownloadedFont]);

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
      return worldJourneyService.getUnitByPos(position);
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
    return worldJourneyService.subscribe('ITEM_ADDED', (item) => {
      worldRenderer.downloadItemModels(item);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribe('PLAYER_ADDED', (player) => {
      worldRenderer.updatePlayer(player);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribe('PLAYER_REMOVED', (player) => {
      worldRenderer.removePlayer(player);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribe('PLAYER_UPDATED', ([, newPlayer]) => {
      worldRenderer.updatePlayer(newPlayer);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribe('MY_PLAYER_POSITION_UPDATED', ([, newPrecisePosition]) => {
      worldRenderer.updateTouchPanelPosition(newPrecisePosition);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribe('UNITS_UPDATED', ([itemId, units]) => {
      const item = worldJourneyService.getItem(itemId);
      if (!item) return;
      worldRenderer.updateUnitsOfItem(item, units, getUnit);
    });
  }, [worldJourneyService, worldRenderer, getUnit]);

  useEffect(() => {
    return worldJourneyService.subscribe('PERSPECTIVE_CHANGED', ([perspectiveDepth, targetPrecisePos]) => {
      worldRenderer.updateCameraPosition(perspectiveDepth, targetPrecisePos);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribe('BLOCKS_UPDATED', (blocks) => {
      worldRenderer.updateBase(blocks);
      worldRenderer.updateGrid(blocks);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldRenderer.subscribeBaseModelsDownloadedEvent(() => {
      worldRenderer.updateBase(worldJourneyService.getBlocks());
      worldRenderer.updateGrid(worldJourneyService.getBlocks());
    });
  }, [worldJourneyService, worldRenderer]);

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
    return worldJourneyService.subscribe('SELECTED_BOUND_UPDATED', (selectedBound) => {
      worldRenderer.updateSelectedBound(selectedBound);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldRenderer.subscribePositionClickedEvent((position) => {
      worldJourneyService.selectPosition(position);
    });
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    if (!hasDownloadedPlayerModel || !hasDownloadedFont) return;

    const players = worldJourneyService.getPlayers();
    players.forEach((player) => {
      worldRenderer.updatePlayer(player);
    });
  }, [hasDownloadedPlayerModel, hasDownloadedFont, worldJourneyService, worldRenderer]);

  return (
    <div
      data-testid={dataTestids.root}
      ref={(ref) => {
        setWrapperDom(ref);
      }}
      className="relative w-full h-full flex"
    />
  );
}
