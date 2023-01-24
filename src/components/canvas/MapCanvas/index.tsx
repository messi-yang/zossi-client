import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

import { ViewVo, UnitVo, OffsetVo, MapVo, SizeVo, LocationVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';
import { PlayerEntity } from '@/models/entities';
import dataTestids from './dataTestids';

type Indexes = [colIdx: number, rowIdx: number];

type ElemSize = {
  width: number;
  height: number;
};

type Resolution = {
  width: number;
  height: number;
};

type ItemMap = {
  [id: string]: ItemAgg;
};

function generateCanvasElemSize(map: MapVo, unitSize: number): ElemSize {
  const mapSize = map.getSize();

  return {
    width: mapSize.getWidth() * unitSize + 1,
    height: mapSize.getHeight() * unitSize + 1,
  };
}

function generateCanvasResolution(map: MapVo, unitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(map, unitSize);

  return {
    width: elemSize.width,
    height: elemSize.height,
  };
}

type Props = {
  players: PlayerEntity[];
  view: ViewVo;
  viewOffset: OffsetVo;
  unitSize: number;
  items: ItemAgg[];
  selectedItemId: string | null;
  onUnitClick: (location: LocationVo) => void;
};

function MapCanvas({ players, view, viewOffset, unitSize, items, selectedItemId, onUnitClick }: Props) {
  const map = view.getMap();
  const bound = view.getBound();
  const [mapCanvasElem, setMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [hoverMaskCanvasElem, setHoverMaskCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [grassBaseImageElem, setGrassBaseImageElem] = useState<HTMLImageElement | null>(null);
  useEffect(function loadGrassBaseImageElemEffect() {
    const image = new Image();
    image.onload = () => {
      setGrassBaseImageElem(image);
    };
    image.src = '/grass-base.png';
  }, []);

  const [mapSize, setSize] = useState(map.getSize());

  const itemMap: ItemMap = useMemo(() => {
    const res: ItemMap = {};
    items.forEach((item) => {
      res[item.getId()] = item;
    });
    return res;
  }, [items]);

  const canvasResolution = useMemo(() => generateCanvasResolution(map, unitSize), [map, unitSize]);
  const canvasElemSize = useMemo(() => generateCanvasElemSize(map, unitSize), [map, unitSize]);

  const getItemAssetImageElemOfUnit = useCallback(
    (unit: UnitVo): HTMLImageElement | null => {
      const itemId = unit.getItemId();
      const item = itemId ? itemMap[itemId] : null;
      return item?.outputAssetAsImageElement() || null;
    },
    [itemMap]
  );

  const getItemAssetImageElemOfItem = useCallback(
    (itemId: string): HTMLImageElement | null => {
      const item = itemId ? itemMap[itemId] : null;
      return item?.outputAssetAsImageElement() || null;
    },
    [itemMap]
  );

  useEffect(() => {
    const newSize = map.getSize();
    if (!mapSize.isEqual(newSize)) {
      setSize(newSize);
    }
  }, [map]);

  const clean = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasResolution.width, canvasResolution.height);
    },
    [canvasResolution]
  );

  const drawUnits = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.beginPath();
      map.iterateUnit((colIdx: number, rowIdx: number, unit: UnitVo) => {
        const leftTopX = colIdx * unitSize;
        const leftTopY = rowIdx * unitSize;

        const assetImgElement = getItemAssetImageElemOfUnit(unit);
        if (grassBaseImageElem) {
          ctx.drawImage(grassBaseImageElem, leftTopX, leftTopY, unitSize, unitSize);
          if (assetImgElement) {
            ctx.drawImage(assetImgElement, leftTopX, leftTopY, unitSize, unitSize);
          }
        }
      });
      ctx.fill();
    },
    [getItemAssetImageElemOfUnit, grassBaseImageElem, map, unitSize]
  );

  const drawPlayer = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      players.forEach((player) => {
        ctx.beginPath();
        const playerLocationInBound = bound.calculateLocationInBound(player.getLocation());
        if (!playerLocationInBound) {
          return;
        }
        const leftTopX = playerLocationInBound.getX() * unitSize;
        const leftTopY = playerLocationInBound.getY() * unitSize;

        const assetImgElement = player.outputAssetAsImageElement();
        if (assetImgElement) {
          ctx.drawImage(assetImgElement, leftTopX, leftTopY, unitSize, unitSize);
        }
        ctx.fill();
      });
    },
    [players, bound, unitSize]
  );

  const draw = useCallback(() => {
    const ctx = mapCanvasElem?.getContext('2d');
    if (!ctx) {
      return;
    }

    clean(ctx);
    drawUnits(ctx);
    drawPlayer(ctx);
  }, [clean, drawUnits, drawPlayer, mapCanvasElem]);

  draw();

  const onMapCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setMapCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newUnitSize: number, newSize: SizeVo): Indexes => {
      let colIdx = Math.floor(relativeX / newUnitSize);
      let rowIdx = Math.floor(relativeY / newUnitSize);
      if (colIdx >= newSize.getWidth()) {
        colIdx = newSize.getWidth() - 1;
      }
      if (rowIdx >= newSize.getHeight()) {
        rowIdx = newSize.getHeight() - 1;
      }

      return [colIdx, rowIdx];
    },
    []
  );

  const drawHoverMask = useCallback(
    (ctx: CanvasRenderingContext2D, newHoveredIndexes: Indexes, newUnitSize: number) => {
      const assetImgElement = selectedItemId ? getItemAssetImageElemOfItem(selectedItemId) : null;

      const leftTopY = newHoveredIndexes[1] * newUnitSize;
      const leftTopX = newHoveredIndexes[0] * newUnitSize;

      ctx.globalAlpha = 0.4; // eslint-disable-line no-param-reassign
      if (assetImgElement) {
        ctx.drawImage(assetImgElement, leftTopX, leftTopY, newUnitSize, newUnitSize);
      } else {
        ctx.fillStyle = 'rgb(237, 28, 37)'; // eslint-disable-line no-param-reassign
        ctx.beginPath();
        ctx.moveTo(leftTopX, leftTopY);
        ctx.lineTo(leftTopX + newUnitSize, leftTopY);
        ctx.lineTo(leftTopX + newUnitSize, leftTopY + newUnitSize);
        ctx.lineTo(leftTopX, leftTopY + (newUnitSize - 1));
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1; // eslint-disable-line no-param-reassign
    },
    [selectedItemId, getItemAssetImageElemOfItem]
  );

  const handleHoverMaskCanvasMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      const ctx = hoverMaskCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      const eventTarget = event.target as Element;
      const eventTargetRect = eventTarget.getBoundingClientRect();
      const [posX, posY] = [event.clientX - eventTargetRect.left, event.clientY - eventTargetRect.top];
      const newHoveredIndexes = calculateIndexes(posX, posY, unitSize, mapSize);

      clean(ctx);
      drawHoverMask(ctx, newHoveredIndexes, unitSize);
    },
    [unitSize, mapSize, hoverMaskCanvasElem, clean, drawHoverMask]
  );

  const handleHoverMaskCanvasMouseMoveDebouncer = useCallback(
    debounce(handleHoverMaskCanvasMouseMove, 75, { maxWait: 75 }),
    [handleHoverMaskCanvasMouseMove]
  );

  const handleHoverMaskCanvasMouseLeave = useCallback(() => {
    const ctx = hoverMaskCanvasElem?.getContext('2d');
    if (!ctx) {
      return;
    }

    handleHoverMaskCanvasMouseMoveDebouncer.cancel();
    clean(ctx);
  }, [hoverMaskCanvasElem, clean]);

  const handleHoverMaskCanvasClick: MouseEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      const eventTarget = event.target as Element;
      const eventTargetRect = eventTarget.getBoundingClientRect();
      const [posX, posY] = [event.clientX - eventTargetRect.left, event.clientY - eventTargetRect.top];
      const [colIdx, rowIdx] = calculateIndexes(posX, posY, unitSize, mapSize);

      const originLocation = bound.getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);
      onUnitClick(finalLocation);
    },
    [bound, onUnitClick]
  );

  const onHoverMaskCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setHoverMaskCanvasElem(elem);
  }, []);

  return (
    <div
      data-testid={dataTestids.root}
      style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      className="relative w-full h-full flex"
    >
      <section
        className="relative flex"
        style={{
          left: (viewOffset?.getX() || 0) * unitSize,
          top: (viewOffset?.getY() || 0) * unitSize,
        }}
      >
        <canvas
          ref={onMapCanvasLoad}
          width={canvasResolution.width}
          height={canvasResolution.height}
          className="absolute left-0 top-0 z-0"
          style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
        />
        <canvas
          ref={onHoverMaskCanvasLoad}
          width={canvasResolution.width}
          height={canvasResolution.height}
          className="absolute left-0 top-0 cursor-pointer"
          onMouseMove={handleHoverMaskCanvasMouseMoveDebouncer}
          onMouseLeave={handleHoverMaskCanvasMouseLeave}
          onClick={handleHoverMaskCanvasClick}
          style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
        />
      </section>
    </div>
  );
}

export default MapCanvas;
export { dataTestids };
