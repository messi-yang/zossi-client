import { useCallback, useRef } from 'react';

import type { UnitVO, MapSizeVO, OffsetVO } from '@/valueObjects';

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
  unitMapOffset: OffsetVO;
};

function UnitMapCanvas({ unitMap, unitSize, unitMapOffset }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const canvasUnitSize = 4;
  const mapSize = generateMapSize(unitMap);
  const canvasElemSize = generateCanvasElemSize(unitMap, unitSize);
  const canvasResolution = generateCanvasResolution(unitMap, unitSize, canvasUnitSize);

  const clean = useCallback((ctx: CanvasRenderingContext2D, newCanvasResolution: Resolution) => {
    ctx.fillStyle = color.bgColor; // eslint-disable-line no-param-reassign
    ctx.fillRect(0, 0, newCanvasResolution.width, newCanvasResolution.height);
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

      for (let colIdx = 0; colIdx < newMapSize.width; colIdx += 1) {
        ctx.moveTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, 0);
        ctx.lineTo(colIdx * newUnitSize * newCanvasUnitSize + newCanvasUnitSize / 2, newCanvasResolution.height);
      }
      ctx.moveTo(newCanvasResolution.width - newCanvasUnitSize / 2, 0);
      ctx.lineTo(newCanvasResolution.width - newCanvasUnitSize / 2, newCanvasResolution.height);

      for (let rowIdx = 0; rowIdx < newMapSize.height; rowIdx += 1) {
        ctx.moveTo(0, rowIdx * newUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
        ctx.lineTo(newCanvasResolution.width, rowIdx * newUnitSize * newCanvasUnitSize + (1 * newCanvasUnitSize) / 2);
      }
      ctx.moveTo(0, newCanvasResolution.height - (1 * newCanvasUnitSize) / 2);
      ctx.lineTo(newCanvasResolution.width, newCanvasResolution.height - (1 * newCanvasUnitSize) / 2);

      ctx.stroke();
    },
    []
  );

  const drawUnits = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      newUnitMap: UnitVO[][],
      newUnitSize: number,
      newUnitMapOffset: OffsetVO,
      newCanvasUnitSize: number
    ) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      for (let colIdx = 0; colIdx < newUnitMap.length; colIdx += 1) {
        for (let rowIdx = 0; rowIdx < newUnitMap[colIdx].length; rowIdx += 1) {
          const unit = newUnitMap[colIdx][rowIdx];

          if (unit.alive) {
            ctx.fillStyle = unit.alive ? color.unitColor : color.bgColor; // eslint-disable-line no-param-reassign
            const leftTopX = ((colIdx + newUnitMapOffset.x) * newUnitSize + 1) * newCanvasUnitSize;
            const leftTopY = ((rowIdx + newUnitMapOffset.y) * newUnitSize + 1) * newCanvasUnitSize;
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

  const draw = useCallback(
    (
      newUnitMap: UnitVO[][],
      newUnitSize: number,
      newUnitMapOffset: OffsetVO,
      newMapSize: MapSizeVO,
      newCanvasResolution: Resolution,
      newCanvasUnitSize: number
    ) => {
      if (!canvasRef.current) {
        return;
      }

      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx, newCanvasResolution);
      drawGrid(ctx, newMapSize, newUnitSize, newCanvasResolution, newCanvasUnitSize);
      drawUnits(ctx, newUnitMap, newUnitSize, newUnitMapOffset, newCanvasUnitSize);
    },
    [canvasRef.current, unitMap, unitSize, unitMapOffset, mapSize, canvasResolution, canvasUnitSize]
  );

  draw(unitMap, unitSize, unitMapOffset, mapSize, canvasResolution, canvasUnitSize);

  return (
    <div data-testid={dataTestids.root} style={{ width: canvasElemSize.width, height: canvasElemSize.height }}>
      <canvas
        ref={canvasRef}
        width={canvasResolution.width}
        height={canvasResolution.height}
        className="w-full h-full bg-black"
      />
    </div>
  );
}

export default UnitMapCanvas;
export { dataTestids };
