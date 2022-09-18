import { useCallback, useState, MouseEventHandler, useEffect } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { UnitVO, UnitMapVO, MapSizeVO, OffsetVO, UnitPatternVO } from '@/valueObjects';
import { generateMapSizeWithUnitMap } from '@/valueObjects/factories';

import dataTestids from './dataTestids';

const color = {
  unitColor: 'white',
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

function generateMapSize(unitMap: UnitMapVO): MapSizeVO {
  return generateMapSizeWithUnitMap(unitMap);
}

function generateCanvasElemSize(unitMap: UnitMapVO, unitSize: number): ElemSize {
  const mapSize = generateMapSize(unitMap);

  return {
    width: mapSize.getWidth() * unitSize + 1,
    height: mapSize.getHeight() * unitSize + 1,
  };
}

function generateCanvasResolution(unitMap: UnitMapVO, unitSize: number, canvasUnitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(unitMap, unitSize);

  return {
    width: elemSize.width * canvasUnitSize,
    height: elemSize.height * canvasUnitSize,
  };
}

function calculateUnitPatternOffset(unitPattern: UnitPatternVO): OffsetVO {
  return new OffsetVO(-Math.floor(unitPattern.getWidth() / 2), -Math.floor(unitPattern.getHeight() / 2));
}

type Props = {
  unitMap: UnitMapVO;
  unitSize: number;
  unitPattern: UnitPatternVO;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function UnitMapCanvas({ unitMap, unitSize, unitPattern, onClick }: Props) {
  const [unitMapCanvasElem, setUnitMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [patternCanvasElem, setPatternCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [borderWidth] = useState(1);
  const [canvasUnitSize] = useState(4);
  const [mapSize, setMapSize] = useState(generateMapSize(unitMap));
  const [canvasElemSize, setCanvasElemSize] = useState(generateCanvasElemSize(unitMap, unitSize));
  const [canvasResolution, setCanvasResolution] = useState(generateCanvasResolution(unitMap, unitSize, canvasUnitSize));
  const [hoveredIndexes, setHoveredIndexes] = useState<Indexes | null>(null);

  useEffect(() => {
    const newMapSize = generateMapSize(unitMap);
    if (!mapSize.isEqual(newMapSize)) {
      setMapSize(newMapSize);
    }
  }, [unitMap]);

  useEffect(() => {
    setCanvasElemSize(generateCanvasElemSize(unitMap, unitSize));
    setCanvasResolution(generateCanvasResolution(unitMap, unitSize, canvasUnitSize));
  }, [mapSize, unitSize, canvasUnitSize]);

  const clean = useCallback((ctx: CanvasRenderingContext2D, newCanvasResolution: Resolution) => {
    ctx.clearRect(0, 0, newCanvasResolution.width, newCanvasResolution.height);
  }, []);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newMapSize: MapSizeVO,
      newUnitSize: number,
      newCanvasResolution: Resolution,
      newCanvasUnitSize: number
    ) => {
      ctx.strokeStyle = color.borderColor; // eslint-disable-line no-param-reassign
      ctx.lineWidth = canvasUnitSize; // eslint-disable-line no-param-reassign
      ctx.beginPath();

      newMapSize.iterateColumn((colIdx: number) => {
        ctx.moveTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, 0);
        ctx.lineTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, newCanvasResolution.height);
      });

      ctx.moveTo(newCanvasResolution.width - newCanvasUnitSize / 2, 0);
      ctx.lineTo(newCanvasResolution.width - newCanvasUnitSize / 2, newCanvasResolution.height);

      newMapSize.iterateRow((rowIdx: number) => {
        ctx.moveTo(0, rowIdx * newUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
        ctx.lineTo(newCanvasResolution.width, rowIdx * newUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
      });

      ctx.moveTo(0, newCanvasResolution.height - (1 * newCanvasUnitSize) / 2);
      ctx.lineTo(newCanvasResolution.width, newCanvasResolution.height - (1 * newCanvasUnitSize) / 2);

      ctx.stroke();
    },
    []
  );

  const drawUnits = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newUnitMap: UnitMapVO,
      newUnitSize: number,
      newCanvasUnitSize: number,
      newBorderWidth: number
    ) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newUnitMap.iterateUnit((colIdx: number, rowIdx: number, unit: UnitVO) => {
        if (unit.isAlive()) {
          ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
          const leftTopX = (colIdx * newUnitSize + newBorderWidth) * newCanvasUnitSize;
          const leftTopY = (rowIdx * newUnitSize + newBorderWidth) * newCanvasUnitSize;
          ctx.moveTo(leftTopX, leftTopY);
          ctx.lineTo(leftTopX + (newUnitSize - newBorderWidth) * newCanvasUnitSize, leftTopY);
          ctx.lineTo(
            leftTopX + (newUnitSize - newBorderWidth) * newCanvasUnitSize,
            leftTopY + (newUnitSize - newBorderWidth) * newCanvasUnitSize
          );
          ctx.lineTo(leftTopX, leftTopY + (newUnitSize - 1) * newCanvasUnitSize);
          ctx.closePath();
        }
      });
      ctx.fill();
    },
    []
  );

  const draw = useCallback(
    (
      newUnitMap: UnitMapVO,
      newUnitSize: number,
      newMapSize: MapSizeVO,
      newCanvasResolution: Resolution,
      newCanvasUnitSize: number
    ) => {
      if (!unitMapCanvasElem) {
        return;
      }

      const ctx = unitMapCanvasElem.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx, newCanvasResolution);
      drawGrid(ctx, newMapSize, newUnitSize, newCanvasResolution, newCanvasUnitSize);
      drawUnits(ctx, newUnitMap, newUnitSize, newCanvasUnitSize, borderWidth);
    },
    [unitMapCanvasElem, unitMap, unitSize, mapSize, canvasResolution, canvasUnitSize, borderWidth]
  );

  draw(unitMap, unitSize, mapSize, canvasResolution, canvasUnitSize);

  const onUnitMapCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setUnitMapCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newUnitSize: number, newMapSize: MapSizeVO): Indexes => {
      let colIdx = Math.floor(relativeX / newUnitSize);
      let rowIdx = Math.floor(relativeY / newUnitSize);
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

  const drawUnitPattern = (
    ctx: CanvasRenderingContext2D,
    newHoveredIndexes: Indexes,
    newUnitPattern: UnitPatternVO,
    newUnitSize: number,
    newBorderWidth: number,
    newCanvasUnitSize: number
  ) => {
    const unitPatternOffset = calculateUnitPatternOffset(newUnitPattern);

    ctx.fillStyle = color.hoverColor; // eslint-disable-line no-param-reassign
    ctx.beginPath();
    newUnitPattern.iterate((colIdx: number, rowIdx: number, alive: boolean) => {
      if (!alive) {
        return;
      }
      const leftTopX =
        ((newHoveredIndexes[0] + colIdx + unitPatternOffset.getX()) * newUnitSize + newBorderWidth) * newCanvasUnitSize;
      const leftTopY =
        ((newHoveredIndexes[1] + rowIdx + unitPatternOffset.getY()) * newUnitSize + newBorderWidth) * newCanvasUnitSize;
      ctx.moveTo(leftTopX, leftTopY);
      ctx.lineTo(leftTopX + (newUnitSize - newBorderWidth) * newCanvasUnitSize, leftTopY);
      ctx.lineTo(
        leftTopX + (newUnitSize - newBorderWidth) * newCanvasUnitSize,
        leftTopY + (newUnitSize - newBorderWidth) * newCanvasUnitSize
      );
      ctx.lineTo(leftTopX, leftTopY + (newUnitSize - 1) * newCanvasUnitSize);
    });
    ctx.closePath();
    ctx.fill();
  };

  const clearUnitPattern = (
    ctx: CanvasRenderingContext2D,
    newHoveredIndexes: Indexes,
    newUnitPattern: UnitPatternVO,
    newUnitSize: number,
    newBorderWidth: number,
    newCanvasUnitSize: number
  ) => {
    const unitPatternOffset = calculateUnitPatternOffset(newUnitPattern);
    const newUnitPatternWidth = newUnitPattern.getWidth();
    const newUnitPatternHeight = newUnitPattern.getHeight();
    ctx.beginPath();
    const leftTopX =
      ((newHoveredIndexes[0] + unitPatternOffset.getX()) * newUnitSize + newBorderWidth) * newCanvasUnitSize;
    const leftTopY =
      ((newHoveredIndexes[1] + unitPatternOffset.getY()) * newUnitSize + newBorderWidth) * newCanvasUnitSize;
    ctx.clearRect(
      leftTopX,
      leftTopY,
      (newUnitPatternWidth * newUnitSize - newBorderWidth) * newCanvasUnitSize,
      (newUnitPatternHeight * newUnitSize - newBorderWidth) * newCanvasUnitSize
    );
  };

  const handleDropPatternCanvasMouseMove: MouseEventHandler<HTMLCanvasElement> = useCallback(
    (event) => {
      const eventTarget = event.target as Element;
      const eventTargetRect = eventTarget.getBoundingClientRect();
      const [posX, posY] = [
        event.clientX - eventTargetRect.left - borderWidth,
        event.clientY - eventTargetRect.top - borderWidth,
      ];
      const newHoveredIndexes = calculateIndexes(posX, posY, unitSize, mapSize);

      if (!isEqual(newHoveredIndexes, hoveredIndexes)) {
        setHoveredIndexes(newHoveredIndexes);
      }
    },
    [hoveredIndexes, unitSize, mapSize, borderWidth]
  );

  const handleDropPatternCanvasMouseMoveDebouncer = useCallback(
    debounce(handleDropPatternCanvasMouseMove, 75, { maxWait: 75 }),
    [handleDropPatternCanvasMouseMove]
  );

  const handleDropPatternCanvasMouseLeave = () => {
    handleDropPatternCanvasMouseMoveDebouncer.cancel();
    setHoveredIndexes(null);
  };

  useEffect(() => {
    const ctx = patternCanvasElem?.getContext('2d');
    if (!ctx) {
      return () => {};
    }

    if (hoveredIndexes) {
      drawUnitPattern(ctx, hoveredIndexes, unitPattern, unitSize, borderWidth, canvasUnitSize);
    }

    return () => {
      if (hoveredIndexes) {
        clearUnitPattern(ctx, hoveredIndexes, unitPattern, unitSize, borderWidth, canvasUnitSize);
      }
    };
  }, [patternCanvasElem, hoveredIndexes, unitPattern, unitSize, borderWidth, canvasUnitSize]);

  const handleDropPatternCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const eventTarget = event.target as Element;
    const eventTargetRect = eventTarget.getBoundingClientRect();
    const [posX, posY] = [
      event.clientX - eventTargetRect.left - borderWidth,
      event.clientY - eventTargetRect.top - borderWidth,
    ];
    const clickedIndexes = calculateIndexes(posX, posY, unitSize, mapSize);
    onClick(clickedIndexes[0], clickedIndexes[1]);
  };

  const onUnitPatternCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setPatternCanvasElem(elem);
  }, []);

  return (
    <div
      data-testid={dataTestids.root}
      style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      className="relative box-border"
    >
      <canvas
        ref={onUnitMapCanvasLoad}
        width={canvasResolution.width}
        height={canvasResolution.height}
        className="absolute left-0 top-0 bg-black z-0"
        style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      />
      <canvas
        ref={onUnitPatternCanvasLoad}
        width={canvasResolution.width}
        height={canvasResolution.height}
        className="absolute left-0 top-0"
        onMouseMove={handleDropPatternCanvasMouseMoveDebouncer}
        onMouseLeave={handleDropPatternCanvasMouseLeave}
        onClick={handleDropPatternCanvasClick}
        style={{ width: canvasElemSize.width, height: canvasElemSize.height }}
      />
    </div>
  );
}

export default UnitMapCanvas;
export { dataTestids };
