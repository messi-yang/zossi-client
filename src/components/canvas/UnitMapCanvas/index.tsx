import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import {
  UnitValueObject,
  UnitMapValueObject,
  MapSizeValueObject,
  OffsetValueObject,
  UnitPatternValueObject,
} from '@/valueObjects';
import { createOffset, createMapSizeByUnitMap } from '@/valueObjects/factories';

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

function generateCanvasElemSize(unitMap: UnitMapValueObject, unitSize: number): ElemSize {
  const mapSize = createMapSizeByUnitMap(unitMap);

  return {
    width: mapSize.getWidth() * unitSize + 1,
    height: mapSize.getHeight() * unitSize + 1,
  };
}

function generateCanvasResolution(unitMap: UnitMapValueObject, unitSize: number, canvasUnitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(unitMap, unitSize);

  return {
    width: elemSize.width * canvasUnitSize,
    height: elemSize.height * canvasUnitSize,
  };
}

function calculateUnitPatternOffset(unitPattern: UnitPatternValueObject): OffsetValueObject {
  return createOffset(-Math.floor(unitPattern.getWidth() / 2), -Math.floor(unitPattern.getHeight() / 2));
}

type Props = {
  unitMap: UnitMapValueObject;
  unitSize: number;
  unitPattern: UnitPatternValueObject;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function UnitMapCanvas({ unitMap, unitSize, unitPattern, onClick }: Props) {
  const [unitMapCanvasElem, setUnitMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [patternCanvasElem, setPatternCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [borderWidth] = useState(1);
  const [canvasUnitSize] = useState(1);
  const [mapSize, setMapSize] = useState(createMapSizeByUnitMap(unitMap));
  const [hoveredIndexes, setHoveredIndexes] = useState<Indexes | null>(null);

  const canvasResolution = useMemo(
    () => generateCanvasResolution(unitMap, unitSize, canvasUnitSize),
    [unitMap, unitSize, canvasUnitSize]
  );
  const canvasElemSize = useMemo(() => generateCanvasElemSize(unitMap, unitSize), [unitMap, unitSize]);

  useEffect(() => {
    const newMapSize = createMapSizeByUnitMap(unitMap);
    if (!mapSize.isEqual(newMapSize)) {
      setMapSize(newMapSize);
    }
  }, [unitMap]);

  const clean = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasResolution.width, canvasResolution.height);
    },
    [canvasResolution]
  );

  const drawGrid = useCallback(
    (ctx: CanvasRenderingContext2D, newMapSize: MapSizeValueObject, newUnitSize: number, newCanvasUnitSize: number) => {
      ctx.strokeStyle = color.borderColor; // eslint-disable-line no-param-reassign
      ctx.lineWidth = canvasUnitSize; // eslint-disable-line no-param-reassign
      ctx.beginPath();

      newMapSize.iterateColumn((colIdx: number) => {
        ctx.moveTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, 0);
        ctx.lineTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, canvasResolution.height);
      });

      ctx.moveTo(canvasResolution.width - newCanvasUnitSize / 2, 0);
      ctx.lineTo(canvasResolution.width - newCanvasUnitSize / 2, canvasResolution.height);

      newMapSize.iterateRow((rowIdx: number) => {
        ctx.moveTo(0, rowIdx * newUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
        ctx.lineTo(canvasResolution.width, rowIdx * newUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
      });

      ctx.moveTo(0, canvasResolution.height - (1 * newCanvasUnitSize) / 2);
      ctx.lineTo(canvasResolution.width, canvasResolution.height - (1 * newCanvasUnitSize) / 2);

      ctx.stroke();
    },
    [canvasResolution]
  );

  const drawUnits = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newUnitMap: UnitMapValueObject,
      newUnitSize: number,
      newCanvasUnitSize: number,
      newBorderWidth: number
    ) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newUnitMap.iterateUnit((colIdx: number, rowIdx: number, unit: UnitValueObject) => {
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
      newUnitMap: UnitMapValueObject,
      newUnitSize: number,
      newMapSize: MapSizeValueObject,
      newCanvasUnitSize: number
    ) => {
      const ctx = unitMapCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx);
      drawGrid(ctx, newMapSize, newUnitSize, newCanvasUnitSize);
      drawUnits(ctx, newUnitMap, newUnitSize, newCanvasUnitSize, borderWidth);
    },
    [unitMapCanvasElem, unitMap, unitSize, mapSize, canvasUnitSize, borderWidth]
  );

  draw(unitMap, unitSize, mapSize, canvasUnitSize);

  const onUnitMapCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setUnitMapCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newUnitSize: number, newMapSize: MapSizeValueObject): Indexes => {
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
    newUnitPattern: UnitPatternValueObject,
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
        clean(ctx);
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
        className="absolute left-0 top-0 cursor-pointer"
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
