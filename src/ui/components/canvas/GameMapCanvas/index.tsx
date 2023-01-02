import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { GameMapUnitVo, GameMapVo, MapSizeVo } from '@/models/valueObjects';

import dataTestids from './dataTestids';

const color = {
  gameMapUnitColor: 'white',
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

function generateCanvasElemSize(gameMap: GameMapVo, gameMapUnitSize: number): ElemSize {
  const mapSize = gameMap.getMapSize();

  return {
    width: mapSize.getWidth() * gameMapUnitSize + 1,
    height: mapSize.getHeight() * gameMapUnitSize + 1,
  };
}

function generateCanvasResolution(gameMap: GameMapVo, gameMapUnitSize: number, canvasUnitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(gameMap, gameMapUnitSize);

  return {
    width: elemSize.width * canvasUnitSize,
    height: elemSize.height * canvasUnitSize,
  };
}

type Props = {
  gameMap: GameMapVo;
  gameMapUnitSize: number;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function GameMapCanvas({ gameMap, gameMapUnitSize, onClick }: Props) {
  const [gameMapCanvasElem, setGameMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [hoverMaskCanvasElem, HoverMaskCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [borderWidth] = useState(1);
  const [canvasUnitSize] = useState(1);
  const [mapSize, setMapSize] = useState(gameMap.getMapSize());
  const [hoveredIndexes, setHoveredIndexes] = useState<Indexes | null>(null);

  const canvasResolution = useMemo(
    () => generateCanvasResolution(gameMap, gameMapUnitSize, canvasUnitSize),
    [gameMap, gameMapUnitSize, canvasUnitSize]
  );
  const canvasElemSize = useMemo(() => generateCanvasElemSize(gameMap, gameMapUnitSize), [gameMap, gameMapUnitSize]);

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
    (ctx: CanvasRenderingContext2D, newMapSize: MapSizeVo, newGameMapUnitSize: number, newCanvasUnitSize: number) => {
      ctx.strokeStyle = color.borderColor; // eslint-disable-line no-param-reassign
      ctx.lineWidth = canvasUnitSize; // eslint-disable-line no-param-reassign
      ctx.beginPath();

      newMapSize.iterateColumn((colIdx: number) => {
        ctx.moveTo(colIdx * newGameMapUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, 0);
        ctx.lineTo(colIdx * newGameMapUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, canvasResolution.height);
      });

      ctx.moveTo(canvasResolution.width - newCanvasUnitSize / 2, 0);
      ctx.lineTo(canvasResolution.width - newCanvasUnitSize / 2, canvasResolution.height);

      newMapSize.iterateRow((rowIdx: number) => {
        ctx.moveTo(0, rowIdx * newGameMapUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
        ctx.lineTo(
          canvasResolution.width,
          rowIdx * newGameMapUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2
        );
      });

      ctx.moveTo(0, canvasResolution.height - (1 * newCanvasUnitSize) / 2);
      ctx.lineTo(canvasResolution.width, canvasResolution.height - (1 * newCanvasUnitSize) / 2);

      ctx.stroke();
    },
    [canvasResolution]
  );

  const drawGameMapUnits = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newGameMap: GameMapVo,
      newGameMapUnitSize: number,
      newCanvasUnitSize: number,
      newBorderWidth: number
    ) => {
      ctx.fillStyle = color.gameMapUnitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newGameMap.iterateGameMapUnit((colIdx: number, rowIdx: number, gameMapUnit: GameMapUnitVo) => {
        if (gameMapUnit.hasItemId()) {
          ctx.fillStyle = color.gameMapUnitColor; // eslint-disable-line no-param-reassign
          const leftTopX = (colIdx * newGameMapUnitSize + newBorderWidth) * newCanvasUnitSize;
          const leftTopY = (rowIdx * newGameMapUnitSize + newBorderWidth) * newCanvasUnitSize;
          ctx.moveTo(leftTopX, leftTopY);
          ctx.lineTo(leftTopX + (newGameMapUnitSize - newBorderWidth) * newCanvasUnitSize, leftTopY);
          ctx.lineTo(
            leftTopX + (newGameMapUnitSize - newBorderWidth) * newCanvasUnitSize,
            leftTopY + (newGameMapUnitSize - newBorderWidth) * newCanvasUnitSize
          );
          ctx.lineTo(leftTopX, leftTopY + (newGameMapUnitSize - 1) * newCanvasUnitSize);
          ctx.closePath();
        }
      });
      ctx.fill();
    },
    []
  );

  const draw = useCallback(
    (newGameMap: GameMapVo, newGameMapUnitSize: number, newMapSize: MapSizeVo, newCanvasUnitSize: number) => {
      const ctx = gameMapCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx);
      drawGrid(ctx, newMapSize, newGameMapUnitSize, newCanvasUnitSize);
      drawGameMapUnits(ctx, newGameMap, newGameMapUnitSize, newCanvasUnitSize, borderWidth);
    },
    [gameMapCanvasElem, gameMap, gameMapUnitSize, mapSize, canvasUnitSize, borderWidth]
  );

  draw(gameMap, gameMapUnitSize, mapSize, canvasUnitSize);

  const onGameMapCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setGameMapCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newGameMapUnitSize: number, newMapSize: MapSizeVo): Indexes => {
      let colIdx = Math.floor(relativeX / newGameMapUnitSize);
      let rowIdx = Math.floor(relativeY / newGameMapUnitSize);
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
    newGameMapUnitSize: number,
    newBorderWidth: number,
    newCanvasUnitSize: number
  ) => {
    ctx.fillStyle = color.hoverColor; // eslint-disable-line no-param-reassign
    ctx.beginPath();
    const leftTopX = (newHoveredIndexes[0] * newGameMapUnitSize + newBorderWidth) * newCanvasUnitSize;
    const leftTopY = (newHoveredIndexes[1] * newGameMapUnitSize + newBorderWidth) * newCanvasUnitSize;
    ctx.moveTo(leftTopX, leftTopY);
    ctx.lineTo(leftTopX + (newGameMapUnitSize - newBorderWidth) * newCanvasUnitSize, leftTopY);
    ctx.lineTo(
      leftTopX + (newGameMapUnitSize - newBorderWidth) * newCanvasUnitSize,
      leftTopY + (newGameMapUnitSize - newBorderWidth) * newCanvasUnitSize
    );
    ctx.lineTo(leftTopX, leftTopY + (newGameMapUnitSize - 1) * newCanvasUnitSize);
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
      const newHoveredIndexes = calculateIndexes(posX, posY, gameMapUnitSize, mapSize);

      if (!isEqual(newHoveredIndexes, hoveredIndexes)) {
        setHoveredIndexes(newHoveredIndexes);
      }
    },
    [hoveredIndexes, gameMapUnitSize, mapSize, borderWidth]
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
      drawHoverMask(ctx, hoveredIndexes, gameMapUnitSize, borderWidth, canvasUnitSize);
    }

    return () => {
      if (hoveredIndexes) {
        clean(ctx);
      }
    };
  }, [hoverMaskCanvasElem, hoveredIndexes, gameMapUnitSize, borderWidth, canvasUnitSize]);

  const handleHoverMaskCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const eventTarget = event.target as Element;
    const eventTargetRect = eventTarget.getBoundingClientRect();
    const [posX, posY] = [
      event.clientX - eventTargetRect.left - borderWidth,
      event.clientY - eventTargetRect.top - borderWidth,
    ];
    const clickedIndexes = calculateIndexes(posX, posY, gameMapUnitSize, mapSize);
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
