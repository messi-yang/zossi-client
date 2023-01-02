import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { MapUnitVo, GameMapVo, MapSizeVo } from '@/models/valueObjects';

import dataTestids from './dataTestids';

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

function generateCanvasElemSize(gameMap: GameMapVo, mapUnitSize: number): ElemSize {
  const mapSize = gameMap.getMapSize();

  return {
    width: mapSize.getWidth() * mapUnitSize + 1,
    height: mapSize.getHeight() * mapUnitSize + 1,
  };
}

function generateCanvasResolution(gameMap: GameMapVo, mapUnitSize: number, canvasUnitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(gameMap, mapUnitSize);

  return {
    width: elemSize.width * canvasUnitSize,
    height: elemSize.height * canvasUnitSize,
  };
}

type Props = {
  gameMap: GameMapVo;
  mapUnitSize: number;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function GameMapCanvas({ gameMap, mapUnitSize, onClick }: Props) {
  const [gameMapCanvasElem, setGameMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [hoverMaskCanvasElem, HoverMaskCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [borderWidth] = useState(1);
  const [canvasUnitSize] = useState(1);
  const [mapSize, setMapSize] = useState(gameMap.getMapSize());
  const [hoveredIndexes, setHoveredIndexes] = useState<Indexes | null>(null);

  const canvasResolution = useMemo(
    () => generateCanvasResolution(gameMap, mapUnitSize, canvasUnitSize),
    [gameMap, mapUnitSize, canvasUnitSize]
  );
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
    (ctx: CanvasRenderingContext2D, newMapSize: MapSizeVo, newMapUnitSize: number, newCanvasUnitSize: number) => {
      ctx.strokeStyle = color.borderColor; // eslint-disable-line no-param-reassign
      ctx.lineWidth = canvasUnitSize; // eslint-disable-line no-param-reassign
      ctx.beginPath();

      newMapSize.iterateColumn((colIdx: number) => {
        ctx.moveTo(colIdx * newMapUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, 0);
        ctx.lineTo(colIdx * newMapUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, canvasResolution.height);
      });

      ctx.moveTo(canvasResolution.width - newCanvasUnitSize / 2, 0);
      ctx.lineTo(canvasResolution.width - newCanvasUnitSize / 2, canvasResolution.height);

      newMapSize.iterateRow((rowIdx: number) => {
        ctx.moveTo(0, rowIdx * newMapUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
        ctx.lineTo(canvasResolution.width, rowIdx * newMapUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
      });

      ctx.moveTo(0, canvasResolution.height - (1 * newCanvasUnitSize) / 2);
      ctx.lineTo(canvasResolution.width, canvasResolution.height - (1 * newCanvasUnitSize) / 2);

      ctx.stroke();
    },
    [canvasResolution]
  );

  const drawMapUnits = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newGameMap: GameMapVo,
      newMapUnitSize: number,
      newCanvasUnitSize: number,
      newBorderWidth: number
    ) => {
      ctx.fillStyle = color.mapUnitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newGameMap.iterateMapUnit((colIdx: number, rowIdx: number, mapUnit: MapUnitVo) => {
        if (mapUnit.hasItemId()) {
          ctx.fillStyle = color.mapUnitColor; // eslint-disable-line no-param-reassign
          const leftTopX = (colIdx * newMapUnitSize + newBorderWidth) * newCanvasUnitSize;
          const leftTopY = (rowIdx * newMapUnitSize + newBorderWidth) * newCanvasUnitSize;
          ctx.moveTo(leftTopX, leftTopY);
          ctx.lineTo(leftTopX + (newMapUnitSize - newBorderWidth) * newCanvasUnitSize, leftTopY);
          ctx.lineTo(
            leftTopX + (newMapUnitSize - newBorderWidth) * newCanvasUnitSize,
            leftTopY + (newMapUnitSize - newBorderWidth) * newCanvasUnitSize
          );
          ctx.lineTo(leftTopX, leftTopY + (newMapUnitSize - 1) * newCanvasUnitSize);
          ctx.closePath();
        }
      });
      ctx.fill();
    },
    []
  );

  const draw = useCallback(
    (newGameMap: GameMapVo, newMapUnitSize: number, newMapSize: MapSizeVo, newCanvasUnitSize: number) => {
      const ctx = gameMapCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx);
      drawGrid(ctx, newMapSize, newMapUnitSize, newCanvasUnitSize);
      drawMapUnits(ctx, newGameMap, newMapUnitSize, newCanvasUnitSize, borderWidth);
    },
    [gameMapCanvasElem, gameMap, mapUnitSize, mapSize, canvasUnitSize, borderWidth]
  );

  draw(gameMap, mapUnitSize, mapSize, canvasUnitSize);

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
    newBorderWidth: number,
    newCanvasUnitSize: number
  ) => {
    ctx.fillStyle = color.hoverColor; // eslint-disable-line no-param-reassign
    ctx.beginPath();
    const leftTopX = (newHoveredIndexes[0] * newMapUnitSize + newBorderWidth) * newCanvasUnitSize;
    const leftTopY = (newHoveredIndexes[1] * newMapUnitSize + newBorderWidth) * newCanvasUnitSize;
    ctx.moveTo(leftTopX, leftTopY);
    ctx.lineTo(leftTopX + (newMapUnitSize - newBorderWidth) * newCanvasUnitSize, leftTopY);
    ctx.lineTo(
      leftTopX + (newMapUnitSize - newBorderWidth) * newCanvasUnitSize,
      leftTopY + (newMapUnitSize - newBorderWidth) * newCanvasUnitSize
    );
    ctx.lineTo(leftTopX, leftTopY + (newMapUnitSize - 1) * newCanvasUnitSize);
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
      drawHoverMask(ctx, hoveredIndexes, mapUnitSize, borderWidth, canvasUnitSize);
    }

    return () => {
      if (hoveredIndexes) {
        clean(ctx);
      }
    };
  }, [hoverMaskCanvasElem, hoveredIndexes, mapUnitSize, borderWidth, canvasUnitSize]);

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
