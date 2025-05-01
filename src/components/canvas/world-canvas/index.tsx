import { useEffect, useMemo, useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { useDomRect } from '@/hooks/use-dom-rect';

import { dataTestids } from './data-test-ids';
import { WorldJourneyService } from '@/services/world-journey-service';
import { WorldRenderer } from './world-renderer';
import { PositionVo } from '@/models/world/common/position-vo';
import { ControlUnitPanel } from '@/components/panels/control-unit-panel';
import { UnitModel } from '@/models/world/unit/unit-model';

type Props = {
  worldJourneyService: WorldJourneyService;
  onPositionClick: (position: PositionVo) => void;
  onPositionHover: (position: PositionVo) => void;
  onPositionDragStart: (position: PositionVo) => void;
  onPositionDragEnd: (position: PositionVo) => void;
  onPositionDragCancel: () => void;
  onRotateUnitClick: (unitId: string) => void;
  onEngageUnitClick: (unitId: string) => void;
  onRemoveUnitClick: (unitId: string) => void;
};

export function WorldCanvas({
  worldJourneyService,
  onPositionClick,
  onPositionHover,
  onPositionDragStart,
  onPositionDragEnd,
  onPositionDragCancel,
  onRotateUnitClick,
  onEngageUnitClick,
  onRemoveUnitClick,
}: Props): React.ReactNode {
  const [wrapperDom, setWrapperDom] = useState<HTMLDivElement | null>(null);
  const wrapperDomRect = useDomRect(wrapperDom);
  const worldRenderer = useMemo(() => WorldRenderer.create(), [worldJourneyService]);

  const updateCameraPosition = useCallback(() => {
    const myPlayerPrecisePosition = worldJourneyService.getMyPlayer().getPrecisePosition();
    const cameraPosition = worldJourneyService.getCameraPosition();

    worldRenderer.updateCameraPosition(myPlayerPrecisePosition.shift(cameraPosition), myPlayerPrecisePosition);
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    if (!wrapperDom) return () => {};

    worldRenderer.mount(wrapperDom);
    updateCameraPosition();

    return () => {
      if (!wrapperDom) return;

      worldRenderer.destroy(wrapperDom);
    };
  }, [worldRenderer, wrapperDom, updateCameraPosition]);

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

      updateCameraPosition();
    });
  }, [worldJourneyService, updateCameraPosition]);

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
    return worldJourneyService.subscribe('CAMERA_POSITION_UPDATED', () => {
      updateCameraPosition();
    });
  }, [worldJourneyService, updateCameraPosition]);

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

  const [unitControlPanelCanvasPosition, setUnitControlPanelCanvasPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  useEffect(() => {
    const interval = setInterval(() => {
      const selectedUnit = worldJourneyService.getSelectedUnit();
      if (!selectedUnit) return;
      const position = worldRenderer.getCanvasPosition(selectedUnit.getCenterPrecisePosition());
      setUnitControlPanelCanvasPosition(position);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [worldJourneyService, worldRenderer]);

  const [selectedUnit, setSelectedUnit] = useState<UnitModel | null>(null);
  useEffect(() => {
    const selectedUnitAddedUnsubscribe = worldJourneyService.subscribe('SELECTED_UNIT_ADDED', (newUnit) => {
      setSelectedUnit(newUnit);
      worldRenderer.updateSelectedBound(newUnit.getOccupiedBound());
      setUnitControlPanelCanvasPosition(worldRenderer.getCanvasPosition(newUnit.getOccupiedBound().getCenterPrecisePosition()));
    });

    const playerUpdatedUnsubscribe = worldJourneyService.subscribe('PLAYER_UPDATED', () => {
      if (!selectedUnit) return;
      setUnitControlPanelCanvasPosition(worldRenderer.getCanvasPosition(selectedUnit.getOccupiedBound().getCenterPrecisePosition()));
    });

    const selectedUnitRemovedUnsubscribe = worldJourneyService.subscribe('SELECTED_UNIT_REMOVED', () => {
      setSelectedUnit(null);
      worldRenderer.updateSelectedBound(null);
    });

    return () => {
      selectedUnitAddedUnsubscribe();
      playerUpdatedUnsubscribe();
      selectedUnitRemovedUnsubscribe();
    };
  }, [worldJourneyService, worldRenderer, selectedUnit]);

  useEffect(() => {
    return worldRenderer.subscribePositionClickEvent((position) => {
      onPositionClick(position);
    });
  }, [worldRenderer, onPositionClick]);

  useEffect(() => {
    return worldRenderer.subscribePositionHoverEvent((position) => {
      onPositionHover(position);
    });
  }, [worldRenderer, onPositionHover]);

  useEffect(() => {
    return worldRenderer.subscribePositionDragStartEvent((position) => {
      onPositionDragStart(position);
    });
  }, [worldRenderer, onPositionDragStart]);

  useEffect(() => {
    return worldRenderer.subscribePositionDragEndEvent((position) => {
      onPositionDragEnd(position);
    });
  }, [worldRenderer, onPositionDragEnd]);

  useEffect(() => {
    return worldRenderer.subscribePositionDragCancelEvent(() => {
      onPositionDragCancel();
    });
  }, [worldRenderer, onPositionDragCancel]);

  useEffect(() => {
    const draggedUnitAddedUnsubscribe = worldJourneyService.subscribe('DRAGGED_UNIT_ADDED', ({ unit }) => {
      const item = worldJourneyService.getItem(unit.getItemId());
      if (!item) return;
      worldRenderer.addDraggedItem(item);
    });

    const draggedUnitPositionUpdatedUnsubscribe = worldJourneyService.subscribe('DRAGGED_UNIT_POSITION_UPDATED', ([, newParams]) => {
      const item = worldJourneyService.getItem(newParams.unit.getItemId());
      if (!item) return;

      worldRenderer.updateDraggedItem(newParams.position, item.getDimension(), newParams.unit.getDirection());
    });

    const draggedUnitRemovedUnsubscribe = worldJourneyService.subscribe('DRAGGED_UNIT_REMOVED', () => {
      worldRenderer.removeDraggedItem();
    });

    return () => {
      draggedUnitAddedUnsubscribe();
      draggedUnitPositionUpdatedUnsubscribe();
      draggedUnitRemovedUnsubscribe();
    };
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    const selectedItemAddedUnsubscribe = worldJourneyService.subscribe('SELECTED_ITEM_ADDED', ({ item, position, direction }) => {
      worldRenderer.addSelectedItem(item, position, direction);
    });

    const selectedItemUpdatedUnsubscribe = worldJourneyService.subscribe('SELECTED_ITEM_UPDATED', ([, { item, position, direction }]) => {
      worldRenderer.updateSelectedItem(item, position, direction);
    });

    const selectedItemRemovedUnsubscribe = worldJourneyService.subscribe('SELECTED_ITEM_REMOVED', () => {
      worldRenderer.removeSelectedItem();
    });

    return () => {
      selectedItemAddedUnsubscribe();
      selectedItemUpdatedUnsubscribe();
      selectedItemRemovedUnsubscribe();
    };
  }, [worldJourneyService, worldRenderer]);

  useEffect(() => {
    return worldJourneyService.subscribe('HOVERED_POSITION_UPDATED', (position) => {
      worldRenderer.updateHoveredPosition(position);
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
    <div className="relative w-full h-full flex">
      <div
        data-testid={dataTestids.root}
        ref={(ref) => {
          setWrapperDom(ref);
        }}
        className="relative w-full h-full flex"
      />
      {selectedUnit && (
        <div
          className={twMerge('fixed', 'z-10', '-translate-x-1/2')}
          style={{ left: unitControlPanelCanvasPosition.x, top: unitControlPanelCanvasPosition.y - 100 }}
        >
          <ControlUnitPanel
            onEngageClick={() => onEngageUnitClick(selectedUnit.getId())}
            onRotateClick={() => onRotateUnitClick(selectedUnit.getId())}
            onRemoveClick={() => onRemoveUnitClick(selectedUnit.getId())}
          />
        </div>
      )}
    </div>
  );
}
