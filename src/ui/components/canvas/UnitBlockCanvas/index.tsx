import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';
import debounce from 'lodash/debounce';

import { UnitVo, UnitBlockVo, DimensionVo } from '@/models/valueObjects';
import { createDimensionByUnitBlock } from '@/models/valueObjects/factories';

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

function generateCanvasElemSize(unitBlock: UnitBlockVo, unitSize: number): ElemSize {
  const dimension = createDimensionByUnitBlock(unitBlock);

  return {
    width: dimension.getWidth() * unitSize + 1,
    height: dimension.getHeight() * unitSize + 1,
  };
}

function generateCanvasResolution(unitBlock: UnitBlockVo, unitSize: number, canvasUnitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(unitBlock, unitSize);

  return {
    width: elemSize.width * canvasUnitSize,
    height: elemSize.height * canvasUnitSize,
  };
}

type Props = {
  unitBlock: UnitBlockVo;
  unitSize: number;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function UnitBlockCanvas({ unitBlock, unitSize, onClick }: Props) {
  const [unitBlockCanvasElem, setUnitBlockCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [hoverMaskCanvasElem, HoverMaskCanvasElem] = useState<HTMLCanvasElement | null>(null);

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
    (ctx: CanvasRenderingContext2D, newDimension: DimensionVo, newUnitSize: number, newCanvasUnitSize: number) => {
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
      newUnitBlock: UnitBlockVo,
      newUnitSize: number,
      newCanvasUnitSize: number,
      newBorderWidth: number
    ) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newUnitBlock.iterateUnit((colIdx: number, rowIdx: number, unit: UnitVo) => {
        if (unit.hasItemId()) {
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
    (newUnitBlock: UnitBlockVo, newUnitSize: number, newDimension: DimensionVo, newCanvasUnitSize: number) => {
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
    (relativeX: number, relativeY: number, newUnitSize: number, newDimension: DimensionVo): Indexes => {
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

  const drawHoverMask = (
    ctx: CanvasRenderingContext2D,
    newHoveredIndexes: Indexes,
    newUnitSize: number,
    newBorderWidth: number,
    newCanvasUnitSize: number
  ) => {
    ctx.fillStyle = color.hoverColor; // eslint-disable-line no-param-reassign
    ctx.beginPath();
    const leftTopX = (newHoveredIndexes[0] * newUnitSize + newBorderWidth) * newCanvasUnitSize;
    const leftTopY = (newHoveredIndexes[1] * newUnitSize + newBorderWidth) * newCanvasUnitSize;
    ctx.moveTo(leftTopX, leftTopY);
    ctx.lineTo(leftTopX + (newUnitSize - newBorderWidth) * newCanvasUnitSize, leftTopY);
    ctx.lineTo(
      leftTopX + (newUnitSize - newBorderWidth) * newCanvasUnitSize,
      leftTopY + (newUnitSize - newBorderWidth) * newCanvasUnitSize
    );
    ctx.lineTo(leftTopX, leftTopY + (newUnitSize - 1) * newCanvasUnitSize);
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
      const newHoveredIndexes = calculateIndexes(posX, posY, unitSize, dimension);

      if (!isEqual(newHoveredIndexes, hoveredIndexes)) {
        setHoveredIndexes(newHoveredIndexes);
      }
    },
    [hoveredIndexes, unitSize, dimension, borderWidth]
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
      drawHoverMask(ctx, hoveredIndexes, unitSize, borderWidth, canvasUnitSize);
    }

    return () => {
      if (hoveredIndexes) {
        clean(ctx);
      }
    };
  }, [hoverMaskCanvasElem, hoveredIndexes, unitSize, borderWidth, canvasUnitSize]);

  const handleHoverMaskCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const eventTarget = event.target as Element;
    const eventTargetRect = eventTarget.getBoundingClientRect();
    const [posX, posY] = [
      event.clientX - eventTargetRect.left - borderWidth,
      event.clientY - eventTargetRect.top - borderWidth,
    ];
    const clickedIndexes = calculateIndexes(posX, posY, unitSize, dimension);
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
        ref={onUnitBlockCanvasLoad}
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

export default UnitBlockCanvas;
export { dataTestids };
