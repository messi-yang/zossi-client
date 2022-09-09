import { useCallback, useEffect, useRef } from 'react';

import type { UnitVO, MapSizeVO } from '@/valueObjects';

import dataTestids from './dataTestids';

const color = {
  unitColor: 'white',
  deadHoverColor: 'rgb(77, 77, 77)',
  bgColor: 'black',
  borderColor: '#141414',
};

type ElemSize = {
  width: number;
  height: number;
};

type Resolution = {
  width: number;
  height: number;
};

function generateMapSize(unitMap: UnitVO[][]): MapSizeVO {
  return {
    width: unitMap.length,
    height: unitMap[0].length,
  };
}

function generateCanvasElemSize(unitMap: UnitVO[][], unitSize: number): ElemSize {
  const mapSize = generateMapSize(unitMap);

  return {
    width: mapSize.width * unitSize + 1,
    height: mapSize.height * unitSize + 1,
  };
}

function generateCanvasResolution(unitMap: UnitVO[][], unitSize: number, canvasUnitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(unitMap, unitSize);

  return {
    width: elemSize.width * canvasUnitSize,
    height: elemSize.height * canvasUnitSize,
  };
}

type Props = {
  unitMap: UnitVO[][];
  unitSize: number;
};

function UnitMapCanvas({ unitMap, unitSize }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const localCanvasUnitSize = useRef(4);
  const localUnitMap = useRef(unitMap);
  const localUnitSize = useRef(unitSize);
  const localMapSize = useRef(generateMapSize(unitMap));
  const localCanvasElemSize = useRef(generateCanvasElemSize(unitMap, unitSize));
  const localCanvasResolution = useRef(generateCanvasResolution(unitMap, unitSize, localCanvasUnitSize.current));

  useEffect(() => {
    localUnitMap.current = unitMap;
    localMapSize.current = generateMapSize(localUnitMap.current);
    localCanvasElemSize.current = generateCanvasElemSize(localUnitMap.current, localUnitSize.current);
    localCanvasResolution.current = generateCanvasResolution(
      localUnitMap.current,
      localUnitSize.current,
      localCanvasUnitSize.current
    );
    localUnitSize.current = unitSize;
  }, [unitMap, unitSize, unitSize]);

  const wipeAll = useCallback((ctx: CanvasRenderingContext2D, newCanvasResolution: Resolution) => {
    ctx.fillStyle = color.bgColor; // eslint-disable-line no-param-reassign
    ctx.fillRect(0, 0, newCanvasResolution.width, newCanvasResolution.height);
  }, []);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newMapSize: MapSizeVO,
      newCanvasResolution: Resolution,
      newCanvasUnitSize: number
    ) => {
      ctx.strokeStyle = color.borderColor; // eslint-disable-line no-param-reassign
      ctx.lineWidth = newCanvasUnitSize; // eslint-disable-line no-param-reassign
      ctx.beginPath();

      for (let colIdx = 0; colIdx < newMapSize.width; colIdx += 1) {
        ctx.moveTo(colIdx * unitSize * newCanvasUnitSize + newCanvasUnitSize / 2, 0);
        ctx.lineTo(colIdx * unitSize * newCanvasUnitSize + newCanvasUnitSize / 2, newCanvasResolution.height);
      }
      ctx.moveTo(newCanvasResolution.width - newCanvasUnitSize / 2, 0);
      ctx.lineTo(newCanvasResolution.width - newCanvasUnitSize / 2, newCanvasResolution.height);

      for (let rowIdx = 0; rowIdx < newMapSize.height; rowIdx += 1) {
        ctx.moveTo(0, rowIdx * unitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
        ctx.lineTo(newCanvasResolution.width, rowIdx * unitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
      }
      ctx.moveTo(0, newCanvasResolution.height - (1 * newCanvasUnitSize) / 2);
      ctx.lineTo(newCanvasResolution.width, newCanvasResolution.height - (1 * newCanvasUnitSize) / 2);

      ctx.stroke();
    },
    []
  );

  const drawUnitMap = useCallback(
    (ctx: CanvasRenderingContext2D, newUnitMap: UnitVO[][], newUnitSize: number, newCanvasUnitSize: number) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      for (let colIdx = 0; colIdx < newUnitMap.length; colIdx += 1) {
        for (let rowIdx = 0; rowIdx < newUnitMap[colIdx].length; rowIdx += 1) {
          const unit = newUnitMap[colIdx][rowIdx];

          if (unit.alive) {
            ctx.fillStyle = unit.alive ? color.unitColor : color.bgColor; // eslint-disable-line no-param-reassign
            const leftTopX = (colIdx * newUnitSize + 1) * newCanvasUnitSize;
            const leftTopY = (rowIdx * newUnitSize + 1) * newCanvasUnitSize;
            ctx.moveTo(leftTopX, leftTopY);
            ctx.lineTo(leftTopX + (newUnitSize - 1) * newCanvasUnitSize, leftTopY);
            ctx.lineTo(
              leftTopX + (newUnitSize - 1) * newCanvasUnitSize,
              leftTopY + (newUnitSize - 1) * newCanvasUnitSize
            );
            ctx.lineTo(leftTopX, leftTopY + (newUnitSize - 1) * newCanvasUnitSize);
            ctx.closePath();
          }
        }
      }
      ctx.fill();
    },
    []
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return () => {};
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
      return () => {};
    }

    const draw = () => {
      wipeAll(ctx, localCanvasResolution.current);
      drawGrid(ctx, localMapSize.current, localCanvasResolution.current, localCanvasUnitSize.current);
      drawUnitMap(ctx, localUnitMap.current, localUnitSize.current, localCanvasUnitSize.current);

      setTimeout(draw, 100);
    };
    const frames = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frames);
    };
  }, [canvasRef.current]);

  return (
    <div
      data-testid={dataTestids.root}
      style={{ width: localCanvasElemSize.current.width, height: localCanvasElemSize.current.height }}
    >
      <canvas
        ref={canvasRef}
        width={localCanvasResolution.current.width}
        height={localCanvasResolution.current.height}
        className="w-full h-full bg-black"
      />
    </div>
  );
}

export default UnitMapCanvas;
export { dataTestids };
