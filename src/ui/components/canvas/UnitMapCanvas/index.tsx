import { useCallback, useState, MouseEventHandler, useEffect, useMemo } from 'react';
import debounce from 'lodash/debounce';

import { UnitVo, UnitMapVo, MapSizeVo } from '@/models/valueObjects';

import { ItemAgg } from '@/models/aggregates';
import dataTestids from './dataTestids';

const color = {
  unitColor: 'white',
  destroyWarningColor: 'rgb(237, 28, 37)',
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

function generateCanvasElemSize(unitMap: UnitMapVo, unitSize: number): ElemSize {
  const mapSize = unitMap.getMapSize();

  return {
    width: mapSize.getWidth() * unitSize + 1,
    height: mapSize.getHeight() * unitSize + 1,
  };
}

function generateCanvasResolution(unitMap: UnitMapVo, unitSize: number): Resolution {
  const elemSize = generateCanvasElemSize(unitMap, unitSize);

  return {
    width: elemSize.width,
    height: elemSize.height,
  };
}

type Props = {
  unitMap: UnitMapVo;
  unitSize: number;
  items: ItemAgg[];
  selectedItemId: string | null;
  onClick: (colIdx: number, rowIdx: number) => void;
};

function UnitMapCanvas({ unitMap, unitSize, items, selectedItemId, onClick }: Props) {
  const [unitMapCanvasElem, setUnitMapCanvasElem] = useState<HTMLCanvasElement | null>(null);
  const [hoverMaskCanvasElem, HoverMaskCanvasElem] = useState<HTMLCanvasElement | null>(null);

  const [grassBaseImageElem, setGrassBaseImageElem] = useState<HTMLImageElement | null>(null);
  useEffect(function loadGrassBaseImageElemEffect() {
    const image = new Image();
    image.onload = () => {
      setGrassBaseImageElem(image);
    };
    image.src = '/grass-base.png';
  }, []);

  const [mapSize, setMapSize] = useState(unitMap.getMapSize());

  const itemMap: ItemMap = useMemo(() => {
    const res: ItemMap = {};
    items.forEach((item) => {
      res[item.getId()] = item;
    });
    return res;
  }, [items]);

  const canvasResolution = useMemo(() => generateCanvasResolution(unitMap, unitSize), [unitMap, unitSize]);
  const canvasElemSize = useMemo(() => generateCanvasElemSize(unitMap, unitSize), [unitMap, unitSize]);

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
    const newMapSize = unitMap.getMapSize();
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

  const drawUnits = useCallback(
    (ctx: CanvasRenderingContext2D, newUnitMap: UnitMapVo, newUnitSize: number) => {
      ctx.fillStyle = color.unitColor; // eslint-disable-line no-param-reassign
      ctx.beginPath();
      newUnitMap.iterateUnit((colIdx: number, rowIdx: number, unit: UnitVo) => {
        const leftTopX = colIdx * newUnitSize;
        const leftTopY = rowIdx * newUnitSize;

        const itemAssetImageElem = getItemAssetImageElemOfUnit(unit);
        if (grassBaseImageElem) {
          ctx.drawImage(grassBaseImageElem, leftTopX, leftTopY, newUnitSize, newUnitSize);
          if (itemAssetImageElem) {
            ctx.drawImage(itemAssetImageElem, leftTopX, leftTopY, newUnitSize, newUnitSize);
          }
        }
      });
      ctx.fill();
    },
    [getItemAssetImageElemOfUnit, grassBaseImageElem]
  );

  const draw = useCallback(
    (newUnitMap: UnitMapVo, newUnitSize: number) => {
      const ctx = unitMapCanvasElem?.getContext('2d');
      if (!ctx) {
        return;
      }

      clean(ctx);
      drawUnits(ctx, newUnitMap, newUnitSize);
    },
    [drawUnits, unitMapCanvasElem, unitMap, unitSize, mapSize]
  );

  draw(unitMap, unitSize);

  const onUnitMapCanvasLoad = useCallback((elem: HTMLCanvasElement) => {
    setUnitMapCanvasElem(elem);
  }, []);

  const calculateIndexes = useCallback(
    (relativeX: number, relativeY: number, newUnitSize: number, newMapSize: MapSizeVo): Indexes => {
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

  const drawHoverMask = useCallback(
    (ctx: CanvasRenderingContext2D, newHoveredIndexes: Indexes, newUnitSize: number) => {
      const itemAssetImageElem = selectedItemId ? getItemAssetImageElemOfItem(selectedItemId) : null;

      const leftTopY = newHoveredIndexes[1] * newUnitSize;
      const leftTopX = newHoveredIndexes[0] * newUnitSize;

      ctx.globalAlpha = 0.4; // eslint-disable-line no-param-reassign
      if (itemAssetImageElem) {
        ctx.drawImage(itemAssetImageElem, leftTopX, leftTopY, newUnitSize, newUnitSize);
      } else {
        ctx.fillStyle = color.destroyWarningColor; // eslint-disable-line no-param-reassign
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

  const handleHoverMaskCanvasClick: MouseEventHandler<HTMLCanvasElement> = (event) => {
    const eventTarget = event.target as Element;
    const eventTargetRect = eventTarget.getBoundingClientRect();
    const [posX, posY] = [event.clientX - eventTargetRect.left, event.clientY - eventTargetRect.top];
    const clickedIndexes = calculateIndexes(posX, posY, unitSize, mapSize);
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
        ref={onUnitMapCanvasLoad}
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
    </div>
  );
}

export default UnitMapCanvas;
export { dataTestids };
