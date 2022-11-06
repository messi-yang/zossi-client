import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import {
  UnitValueObject,
  UnitBlockValueObject,
  DimensionValueObject,
  OffsetValueObject,
  UnitPatternValueObject,
} from '@/valueObjects';
import { createOffset, createDimensionByUnitBlock } from '@/valueObjects/factories';

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

function generateCanvasElemSize(unitBlock: UnitBlockValueObject, unitSize: number): ElemSize {
  const dimension = createDimensionByUnitBlock(unitBlock);

  return {
    width: dimension.getWidth() * unitSize + 1,
    height: dimension.getHeight() * unitSize + 1,
  };
}

function generateCanvasResolution(
  unitBlock: UnitBlockValueObject,
  unitSize: number,
  canvasUnitSize: number
): Resolution {
  const elemSize = generateCanvasElemSize(unitBlock, unitSize);

  return {
    width: elemSize.width * canvasUnitSize,
    height: elemSize.height * canvasUnitSize,
  };
}

function calculateUnitPatternOffset(unitPattern: UnitPatternValueObject): OffsetValueObject {
  return createOffset(-Math.floor(unitPattern.getWidth() / 2), -Math.floor(unitPattern.getHeight() / 2));
}

type Props = {
  unitBlock: UnitBlockValueObject;
  unitSize: number;
  unitPattern: UnitPatternValueObject;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function UnitBlockCanvas({ unitBlock, unitSize, unitPattern, onClick }: Props) {
  const [unitBlockCanvasElem, setUnitBlockCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [patternCanvasElem, setPatternCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [borderWidth] = useState(1);
  const [canvasUnitSize] = useState(1);
  const [dimension, setDimension] = useState(createDimensionByUnitBlock(unitBlock));
  const [hoveredIndexes, setHoveredIndexes] = useState<Indexes | null>(null);

  const canvasResolution = useMemo(
    () => generateCanvasResolution(unitBlock, unitSize, canvasUnitSize),
    [unitBlock, unitSize, canvasUnitSize]
  );
  const canvasElemSize = useMemo(() => generateCanvasElemSize(unitBlock, unitSize), [unitBlock, unitSize]);

  useEffect(() => {
    const newDimension = createDimensionByUnitBlock(unitBlock);
    if (!dimension.isEqual(newDimension)) {
      setDimension(newDimension);
    }
  }, [unitBlock]);

  const clean = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      ctx.clearRect(0, 0, canvasResolution.width, canvasResolution.height);
    },
    [canvasResolution]
  );

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newDimension: DimensionValueObject,
      newUnitSize: number,
      newCanvasUnitSize: number
    ) => {
      ctx.strokeStyle = color.borderColor; // eslint-disable-line no-param-reassign
      ctx.lineWidth = canvasUnitSize; // eslint-disable-line no-param-reassign
      ctx.beginPath();

      newDimension.iterateColumn((colIdx: number) => {
        ctx.moveTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, 0);
        ctx.lineTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, canvasResolution.height);
      });

      ctx.moveTo(canvasResolution.width - newCanvasUnitSize / 2, 0);
      ctx.lineTo(canvasResolution.width - newCanvasUnitSize / 2, canvasResolution.height);

      newDimension.iterateRow((rowIdx: number) => {
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
      newUnitBlock: UnitBlockValueObject,
      newUnitSize: number,
      newCanvasUnitSize: number,
      newBorderWidth: number
    ) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newUnitBlock.iterateUnit((colIdx: number, rowIdx: number, unit: UnitValueObject) => {
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
      newUnitBlock: UnitBlockValueObject,
      newUnitSize: number,
      newDimension: DimensionValueObject,
      newCanvasUnitSize: number
    ) => {
      const ctx = unitBlockCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx);
      drawGrid(ctx, newDimension, newUnitSize, newCanvasUnitSize);
      drawUnits(ctx, newUnitBlock, newUnitSize, newCanvasUnitSize, borderWidth);
    },
    [unitBlockCanvasElem, unitBlock, unitSize, dimension, canvasUnitSize, borderWidth]
  );

  draw(unitBlock, unitSize, dimension, canvasUnitSize);

  const onUnitBlockCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setUnitBlockCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newUnitSize: number, newDimension: DimensionValueObject): Indexes => {
      let colIdx = Math.floor(relativeX / newUnitSize);
      let rowIdx = Math.floor(relativeY / newUnitSize);
      if (colIdx >= newDimension.getWidth()) {
        colIdx = newDimension.getWidth() - 1;
      }
      if (rowIdx >= newDimension.getHeight()) {
        rowIdx = newDimension.getHeight() - 1;
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
      const newHoveredIndexes = calculateIndexes(posX, posY, unitSize, dimension);

      if (!isEqual(newHoveredIndexes, hoveredIndexes)) {
        setHoveredIndexes(newHoveredIndexes);
      }
    },
    [hoveredIndexes, unitSize, dimension, borderWidth]
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
    const clickedIndexes = calculateIndexes(posX, posY, unitSize, dimension);
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
        ref={onUnitBlockCanvasLoad}
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

export default UnitBlockCanvas;
export { dataTestids };
