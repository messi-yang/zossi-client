import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { MapUnitVo, GameMapVo, MapSizeVo } from '@/models/valueObjects';

import dataTestids from './dataTestids';
import { ItemAgg } from '@/models/aggregates';

const color = {
  mapUnitColor: 'white',
  hoverColor: 'rgba(255, 255, 255, 0.2)',
  bgColor: 'black',
  borderColor: '#141414',
};

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

function generateCanvasElemSize(gameMap: GameMapVo, mapUnitSize: number): ElemSize {
  const mapSize = gameMap.getMapSize();

  return {
    width: mapSize.getWidth() * mapUnitSize + 1,
    height: mapSize.getHeight() * mapUnitSize + 1,
  };
}

function generateCanvasResolution(gameMap: GameMapVo, mapUnitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(gameMap, mapUnitSize);

  return {
    width: elemSize.width,
    height: elemSize.height,
  };
}

type Props = {
  gameMap: GameMapVo;
  mapUnitSize: number;
  items: ItemAgg[];
  onClick: (colIdx: number, rowIdx: number) => void;
};

function GameMapCanvas({ gameMap, mapUnitSize, items, onClick }: Props) {
  const [gameMapCanvasElem, setGameMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [hoverMaskCanvasElem, HoverMaskCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [borderWidth] = useState(1);
  const [mapSize, setMapSize] = useState(gameMap.getMapSize());
  const [hoveredIndexes, setHoveredIndexes] = useState<Indexes | null>(null);

  const itemMap: ItemMap = useMemo(() => {
    const res: ItemMap = {};
    items.forEach((item) => {
      res[item.getId()] = item;
    });
    return res;
  }, [items]);

  const canvasResolution = useMemo(() => generateCanvasResolution(gameMap, mapUnitSize), [gameMap, mapUnitSize]);
  const canvasElemSize = useMemo(() => generateCanvasElemSize(gameMap, mapUnitSize), [gameMap, mapUnitSize]);

  useEffect(() => {
    const newMapSize = gameMap.getMapSize();
    if (!mapSize.isEqual(newMapSize)) {
      setMapSize(newMapSize);
    }
  }, [gameMap]);

  const clean = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasResolution.width, canvasResolution.height);
    },
    [canvasResolution]
  );

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, newMapSize: MapSizeVo, newMapUnitSize: number) => {
      ctx.strokeStyle = color.borderColor; // eslint-disable-line no-param-reassign
      ctx.lineWidth = 1; // eslint-disable-line no-param-reassign
      ctx.beginPath();

      newMapSize.iterateColumn((colIdx: number) => {
        ctx.moveTo(colIdx * newMapUnitSize + 0.5, 0);
        ctx.lineTo(colIdx * newMapUnitSize + 0.5, canvasResolution.height);
      });

      ctx.moveTo(canvasResolution.width - 0.5, 0);
      ctx.lineTo(canvasResolution.width - 0.5, canvasResolution.height);

      newMapSize.iterateRow((rowIdx: number) => {
        ctx.moveTo(0, rowIdx * newMapUnitSize + 0.5);
        ctx.lineTo(canvasResolution.width, rowIdx * newMapUnitSize + 0.5);
      });

      ctx.moveTo(0, canvasResolution.height - 0.5);
      ctx.lineTo(canvasResolution.width, canvasResolution.height - 0.5);

      ctx.stroke();
    },
    [canvasResolution]
  );

  const drawMapUnits = useCallback(
    (ctx: CanvasRenderingContext2D, newGameMap: GameMapVo, newMapUnitSize: number, newBorderWidth: number) => {
      ctx.fillStyle = color.mapUnitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newGameMap.iterateMapUnit((colIdx: number, rowIdx: number, mapUnit: MapUnitVo) => {
        const itemId = mapUnit.getItemId();
        const item = itemId ? itemMap[itemId] : null;
        const itemAssetImageElem = item?.getAssetImageElem();
        if (itemAssetImageElem) {
          const leftTopX = colIdx * newMapUnitSize + newBorderWidth;
          const leftTopY = rowIdx * newMapUnitSize + newBorderWidth;

          ctx.drawImage(
            itemAssetImageElem,
            leftTopX,
            leftTopY,
            newMapUnitSize - newBorderWidth,
            newMapUnitSize - newBorderWidth
          );
        }
      });
      ctx.fill();
    },
    [items]
  );

  const draw = useCallback(
    (newGameMap: GameMapVo, newMapUnitSize: number, newMapSize: MapSizeVo) => {
      const ctx = gameMapCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx);
      drawGrid(ctx, newMapSize, newMapUnitSize);
      drawMapUnits(ctx, newGameMap, newMapUnitSize, borderWidth);
    },
    [drawMapUnits, gameMapCanvasElem, gameMap, mapUnitSize, mapSize, borderWidth]
  );

  draw(gameMap, mapUnitSize, mapSize);

  const onGameMapCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setGameMapCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newMapUnitSize: number, newMapSize: MapSizeVo): Indexes => {
      let colIdx = Math.floor(relativeX / newMapUnitSize);
      let rowIdx = Math.floor(relativeY / newMapUnitSize);
      if (colIdx >= newMapSize.getWidth()) {
        colIdx = newMapSize.getWidth() - 1;
      }
      if (rowIdx >= newMapSize.getHeight()) {
        rowIdx = newMapSize.getHeight() - 1;
      }

      return [colIdx, rowIdx];
    },
    []
  );

  const drawHoverMask = (
    ctx: CanvasRenderingContext2D,
    newHoveredIndexes: Indexes,
    newMapUnitSize: number,
    newBorderWidth: number
  ) => {
    ctx.fillStyle = color.hoverColor; // eslint-disable-line no-param-reassign
    ctx.beginPath();
    const leftTopX = newHoveredIndexes[0] * newMapUnitSize + newBorderWidth;
    const leftTopY = newHoveredIndexes[1] * newMapUnitSize + newBorderWidth;
    ctx.moveTo(leftTopX, leftTopY);
    ctx.lineTo(leftTopX + (newMapUnitSize - newBorderWidth), leftTopY);
    ctx.lineTo(leftTopX + (newMapUnitSize - newBorderWidth), leftTopY + (newMapUnitSize - newBorderWidth));
    ctx.lineTo(leftTopX, leftTopY + (newMapUnitSize - 1));
    ctx.closePath();
    ctx.fill();
  };

  const handleHoverMaskCanvasMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      const eventTarget = event.target as Element;
      const eventTargetRect = eventTarget.getBoundingClientRect();
      const [posX, posY] = [
        event.clientX - eventTargetRect.left - borderWidth,
        event.clientY - eventTargetRect.top - borderWidth,
      ];
      const newHoveredIndexes = calculateIndexes(posX, posY, mapUnitSize, mapSize);

      if (!isEqual(newHoveredIndexes, hoveredIndexes)) {
        setHoveredIndexes(newHoveredIndexes);
      }
    },
    [hoveredIndexes, mapUnitSize, mapSize, borderWidth]
  );

  const handleHoverMaskCanvasMouseMoveDebouncer = useCallback(
    debounce(handleHoverMaskCanvasMouseMove, 75, { maxWait: 75 }),
    [handleHoverMaskCanvasMouseMove]
  );

  const handleHoverMaskCanvasMouseLeave = () => {
    handleHoverMaskCanvasMouseMoveDebouncer.cancel();
    setHoveredIndexes(null);
  };

  useEffect(() => {
    const ctx = hoverMaskCanvasElem?.getContext('2d');
    if (!ctx) {
      return () => {};
    }

    if (hoveredIndexes) {
      drawHoverMask(ctx, hoveredIndexes, mapUnitSize, borderWidth);
    }

    return () => {
      if (hoveredIndexes) {
        clean(ctx);
      }
    };
  }, [hoverMaskCanvasElem, hoveredIndexes, mapUnitSize, borderWidth]);

  const handleHoverMaskCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const eventTarget = event.target as Element;
    const eventTargetRect = eventTarget.getBoundingClientRect();
    const [posX, posY] = [
      event.clientX - eventTargetRect.left - borderWidth,
      event.clientY - eventTargetRect.top - borderWidth,
    ];
    const clickedIndexes = calculateIndexes(posX, posY, mapUnitSize, mapSize);
    onClick(clickedIndexes[0], clickedIndexes[1]);
  };

  const onHoverMaskCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    HoverMaskCanvasElem(elem);
  }, []);

  return (
    <div
      data-testid={dataTestids.root}
      style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      className="relative box-border"
    >
      <canvas
        ref={onGameMapCanvasLoad}
        width={canvasResolution.width}
        height={canvasResolution.height}
        className="absolute left-0 top-0 bg-black z-0"
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
    </div>
  );
}

export default GameMapCanvas;
export { dataTestids };
